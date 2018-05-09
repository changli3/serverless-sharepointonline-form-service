
window.ListManager = function() {
	
	var oListItem;
	var attachmentFiles;

	var getAttachments = function (listTitle, listItemId, success, failed) {
		var list = web.get_lists().getByTitle(listTitle);
		var attachmentFolder = web.getFileByServerRelativeUrl(String.format('{0}/Attachments/{1}', list.get_rootFolder().get_serverRelativeUrl(), listItemId));

		var attachmentFiles= attachmentFolder.get_files();

	    ctx.load(attachmentFiles);
		ctx.executeQueryAsync(		
			function() {
				//for(var file in attachmentFiles)
				//{                             
				//	alert(file.get_serverRelativeUrl());
				//	i++;
				//}				
				if (success) success(this.attachmentFiles);
			},
			function(sender, args) {
				if (failed) failed(args);
			}		
		);

	}
 		
	var deleteListItem =  function (listTitle, itemId, success, failed) {
		var oList = clientContext.get_web().get_lists().getByTitle(listTitle);
		var oListItem = oList.getItemById(itemId);
		oListItem.deleteObject();
		clientContext.executeQueryAsync(
			success, 
			function(sender, args) {
				if (failed) failed(args);
			}
		);
	}
	
	var updateListItem = function(listTitle, listItemId, fields, success, failed) {
		var clientContext = new SP.ClientContext(siteUrl);
		var oList = clientContext.get_web().get_lists().getByTitle(listTitle');
		var oListItem = oList.getItemById(listItemId);
		Object.keys(fields).forEach(function(key,index) {
			oListItem.set_item(key, fields[key]);
		});	
		oListItem.update();
		clientContext.executeQueryAsync(
			success, 
			function(sender, args) {
				if (failed) failed(args);
			}
		);
	}
		
	var createListItem = function (listTitle, success, failed) {
		var oList = ctx.get_web().get_lists().getByTitle(listTitle);				
		var itemCreateInfo = new SP.ListItemCreationInformation();
		this.oListItem = oList.addItem(itemCreateInfo);				
		Object.keys(fields).forEach(function(key,index) {
			this.oListItem.set_item(key, fields[key]);
		});				
		this.oListItem.update();
		ctx.load(this.oListItem);
		ctx.executeQueryAsync(
			function() {
				if (success) success(this.oListItem);
			},
			function(sender, args) {
				if (failed) failed(args);
			}
		);
	}

	var deleteAttachment = function(listTitle, listItemId, fileName, success, failed) {
		var list = web.get_lists().getByTitle(listTitle);
		var file = web.getFileByServerRelativeUrl(String.format('{0}/Attachments/{1}/{2}', list.get_rootFolder().get_serverRelativeUrl(), listItemId, fileName));
		file.deleteObject();
		ctx.executeQueryAsync(
			success,
			function(sender, args) {
				if (failed) failed(args);
			}
		);
	}

	var processUpload = function(fileInput, listTitle, itemId, success, error) {
		var reader = new FileReader();
		reader.onload = function (result) {
			var fileContent = new Uint8Array(result.target.result);
			this.performAttachmentUpload(listTitle, fileInput.name, itemId, fileContent, success,
			function(sender, args) {
				if (failed) failed(args);
			});
		};
		reader.readAsArrayBuffer(fileInput);
	}

	var performAttachmentUpload = function(listTitle, fileName, itemId, fileContent, success, error) {
		this.ensureAttachmentFolder(listTitle,itemId, 
		   function(folder){
			   var attachmentFolderUrl = folder.get_serverRelativeUrl();
			   this.uploadFile(attachmentFolderUrl, fileName, fileContent, success, error);
		   },
		   error);
	}

	var ensureAttachmentFolder = function(listTitle,itemId, success,error)
	{
		  var list = web.get_lists().getByTitle(listTitle);
		  ctx.load(list,'RootFolder');
		  var item = list.getItemById(itemId);
		  ctx.load(item);
		  ctx.executeQueryAsync(
			function() {
				var attachmentsFolder;
				if(!item.get_fieldValues()['Attachments']) { /* Attachments folder exists? */
				   var attachmentRootFolderUrl = String.format('{0}/Attachments', list.get_rootFolder().get_serverRelativeUrl()); 
				   var attachmentsRootFolder = ctx.get_web().getFolderByServerRelativeUrl(attachmentRootFolderUrl);

				   attachmentsFolder = attachmentsRootFolder.get_folders().add('_' + itemId);
				   attachmentsFolder.moveTo(attachmentRootFolderUrl + '/' + itemId);
				   ctx.load(attachmentsFolder);
				}
				else {
				   var attachmentFolderUrl = String.format('{0}/Attachments/{1}', list.get_rootFolder().get_serverRelativeUrl(), itemId); 
				   attachmentsFolder = ctx.get_web().getFolderByServerRelativeUrl(attachmentFolderUrl);
				   ctx.load(attachmentsFolder);
				}         
				ctx.executeQueryAsync(
					 function() {
						 success(attachmentsFolder); 
					 },
					 error);
			},
			error);
	}

	var getListItemByMe = function (listTitle, fields, success, failed) {
		var qt = "<Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where>";
		this.getListItemsByQuery(listTitle, qt, fields, success, failed);
	}
	
	var getListItemByColValStat = function (listTitle, colName, colValue, status, fields, success, failed) {
		var qt = "<Where><And><Eq><FieldRef Name='status'/><Value Type='Number'>" + status + "</Value></Eq>" +
			"<Eq><FieldRef Name='" + colName + "'><Value Type='Text'>" + colValue + "</Value></Eq></And></Where>";
		this.getListItemsByQuery(listTitle, qt, fields, success, failed);
	}
	
	var getListItemsByQuery = function (listTitle, queryXML, fields, success, failed) {
		var oList = clientContext.get_web().get_lists().getByTitle(listTitle);
		var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View><Query>" + queryXML + "</Query><RowLimit>800</RowLimit></View>");
		this.oListItem = oList.getItems(camlQuery);
		ctx.load(this.oListItem, 'Include(' + fields.join(',') + ')');

		ctx.executeQueryAsync (
			function(){
				if (!success) return;
			    var listItemEnumerator = this.oListItem.getEnumerator();
				results = [];
				while (listItemEnumerator.moveNext()) {
					var item = listItemEnumerator.get_current();
					var oitem = {};
					oitem.id = item.get_id();
					var l = fields.length;
					for (var i=0; i<l; i++) {
						var f = fields[i];
						if (f == 'Id') continue;
						oitem[f] = item.get_item(f);
					}
					results.push(otime);
				}
				success(results);
			},
			function(sender, args) {
				if (failed) failed(args);
			});
	}

	
	return this;
}