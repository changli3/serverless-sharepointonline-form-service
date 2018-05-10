var context;
var web;
var user;

function initCommunicator() {
	//assume we have a client context called context.
	context= new SP.ClientContext.get_current();
	web = context.get_web();
	user = web.get_currentUser(); //must load this to access info.
	context.load(user);
	context.executeQueryAsync(function(){
	    console.log("User is: " + user.get_title()); //there is also id, email, so this is pretty useful.
	}, function(err){
		console.log(err);
	});
    parent.communicatorReady();
}

window.getCurrentUser = function() {
	return user;
}

window.getCurrentUserId = function() {
 return _spPageContextInfo.userId;
}

window.GetUserIdByName =function (userName) {
    var prefix = "i:0#.w|";
    var siteUrl = _spPageContextInfo.siteAbsoluteUrl;
    var accountName = prefix + userName;

    /// make an ajax call to get the site user
    $.ajax({
        url: siteUrl + "/_api/web/siteusers(@v)?@v='" + 
            encodeURIComponent(accountName) + "'",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            ///popup user id received from site users.
            console.log("Received UserId" + data.d.Id);
            console.log(JSON.stringify(data));
        },
        error: function (data) {
            console.log(JSON.stringify(data));
        }
    });
}

window.getUserGroups= function (UserID, callback)   
{  
	$.ajax  
	({  
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetUserById(" + UserID + ")/Groups",  
		method: "GET",  
		headers: { "Accept": "application/json; odata=verbose" },  
		success: function (data) {  
			callback(data.d.results);  
		}  
	});  
}  

window.getUserIdByEmail=function(email, callback) {
	$.ajax  
	({  
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/SiteUsers?$filter=Email eq '" + encodeURIComponent(email) + "'",  
		method: "GET",  
		headers: { "Accept": "application/json; odata=verbose" },  
		success: function (data) {
		    if (data.d.results.length > 0)
				callback(data.d.results[0]);
			else 
			    callback(null);  
		}  
	});  
}  


window.ListManager = function(success, failed) {
	
	var getListItemById = function (listTitle, listItemId, fields, success, failed) {	
		var targetList = web.get_lists().getByTitle(listTitle);
		var targetListItem = targetList.getItemById(listItemId);
        ctx.load(targetListItem, 'Include(' + fields.join(',') + ')');
		ctx.executeQueryAsync (
			function(){
				if (!success) return;
			    var listItemEnumerator = targetListItem.getEnumerator();
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
			}, failed);
	}
	
	var copyAttachments = function (listTitle1, listItemId1, listTitle2, listItemId2, success, failed) {	

		this.ensureAttachmentFolder(listTitle2, listItemId2,
		  function(folder, folderUrl) {
			var list = web.get_lists().getByTitle(listTitle1);
			var src = web.getFileByServerRelativeUrl(String.format('{0}/Attachments/{1}', list.get_rootFolder().get_serverRelativeUrl(), listItemId1));

			var folder1 = myWeb.getFolderByServerRelativeUrl(src);		  
			var files = folder1.get_files();
			ctx.load(files);

			ctx.executeQueryAsync(
				function() {
					for (var p = 0; p < files.get_count(); p++) {
						
						var file = files.itemAt(p);
						var filename = file.get_name(); 
						if (filename != null) {
							var newUrl = folderUrl + '/' + filename;
							file.copyTo(newUrl, true);
							ctx.executeQueryAsync(
								function() {
									console.log(filename  + " copied.");
								},
								function() {
									console.log(filename  + " failed.");
							});
						}
					}
					
				}, failed);
			
		 }, failed); 
		  
	}

	var getUserGroups = function(success, failed) {
		var currentUser = web.get_currentUser();
		var allGroups = currentUser.get_groups();
		ctx.load(allGroups);
		ctx.executeQueryAsync(
			function (sender, args)
			{
				if (!success) return;
				var grpsEnumerator = allGroups.getEnumerator();
				var groups = [];
				while(grpsEnumerator.moveNext())
				{
					var group = grpsEnumerator.get_current();
					groups.push(group.get_title());
				}
				success(groups);
			},
			failed		
		);
	}
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
				if (success) success(attachmentFiles);
			},
			failed		
		);

	}
 		
	var deleteListItem =  function (listTitle, itemId, success, failed) {
		var oList = web.get_lists().getByTitle(listTitle);
		var oListItem = oList.getItemById(itemId);
		oListItem.deleteObject();
		ctx.executeQueryAsync(
			success, 
			failed
		);
	}
	
	var updateListItem = function(listTitle, listItemId, fields, success, failed) {
		var oList = web.get_lists().getByTitle(listTitle);
		var oListItem = oList.getItemById(listItemId);
		Object.keys(fields).forEach(function(key,index) {
			oListItem.set_item(key, fields[key]);
		});	
		oListItem.update();
		ctx.executeQueryAsync(
			success, 
			failed
		);
	}
		
	var createListItem = function (listTitle, success, failed) {
		var oList = w.get_lists().getByTitle(listTitle);				
		var itemCreateInfo = new SP.ListItemCreationInformation();
		var oListItem = oList.addItem(itemCreateInfo);				
		Object.keys(fields).forEach(function(key,index) {
			oListItem.set_item(key, fields[key]);
		});				
		oListItem.update();
		ctx.load(oListItem);
		ctx.executeQueryAsync(
			function() {
				if (success) success(oListItem);
			},
			failed
		);
	}

	var deleteAttachment = function(listTitle, listItemId, fileName, success, failed) {
		var list = web.get_lists().getByTitle(listTitle);
		var file = web.getFileByServerRelativeUrl(String.format('{0}/Attachments/{1}/{2}', list.get_rootFolder().get_serverRelativeUrl(), listItemId, fileName));
		file.deleteObject();
		ctx.executeQueryAsync(
			success,
			failed
		);
	}

	var processUpload = function(fileInput, listTitle, itemId, success, error) {
		var reader = new FileReader();
		reader.onload = function (result) {
			var fileContent = new Uint8Array(result.target.result);
			this.performAttachmentUpload(listTitle, fileInput.name, itemId, fileContent, success, error);
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
				   var attachmentsRootFolder = web.getFolderByServerRelativeUrl(attachmentRootFolderUrl);

				   attachmentsFolder = attachmentsRootFolder.get_folders().add('_' + itemId);
				   attachmentsFolder.moveTo(attachmentRootFolderUrl + '/' + itemId);
				   ctx.load(attachmentsFolder);
				}
				else {
				   var attachmentFolderUrl = String.format('{0}/Attachments/{1}', list.get_rootFolder().get_serverRelativeUrl(), itemId); 
				   attachmentsFolder = web.getFolderByServerRelativeUrl(attachmentFolderUrl);
				   ctx.load(attachmentsFolder);
				}         
				ctx.executeQueryAsync(
					 function() {
						 success(attachmentsFolder, attachmentFolderUrl); 
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
		var oList = web.get_lists().getByTitle(listTitle);
		var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View><Query>" + queryXML + "</Query><RowLimit>800</RowLimit></View>");
		var oListItem = oList.getItems(camlQuery);
		ctx.load(oListItem, 'Include(' + fields.join(',') + ')');

		ctx.executeQueryAsync (
			function(){
				if (!success) return;
			    var listItemEnumerator = oListItem.getEnumerator();
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
			},failed);
	}
	
	return this;
}


_spBodyOnLoadFunctionNames.push("initCommunicator");
