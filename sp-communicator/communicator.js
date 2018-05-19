var ctx;
var web;
var user;

function initCommunicator() {
	//assume we have a client context called context.
	ctx= new SP.ClientContext.get_current();
	web = ctx.get_web();
	user = web.get_currentUser(); //must load this to access info.
	ctx.load(user);
	ctx.executeQueryAsync(function(){
	    console.log("User is: " + user.get_title()); //there is also id, email, so this is pretty useful.
	}, function(err){
		console.log(err);
	});
    setTimeout("initParent()", 80);
}

function initParent() {
	try {
		parent.communicatorReady();
	} catch (e) {
		setTimeout("initParent()", 800);
	}
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


window.copyAttachments = function (listTitle1, listItemId1, listTitle2, listItemId2, success, failed) {	

		ensureAttachmentFolder(listTitle2, listItemId2,
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

window.getUserGroups2 = function(success, failed) {
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
window.getAttachments = function (listTitle, listItemId, success, failed) {
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
 		
window.deleteListItem =  function (listTitle, itemId, success, failed) {
		var oList = web.get_lists().getByTitle(listTitle);
		var oListItem = oList.getItemById(itemId);
		oListItem.deleteObject();
		ctx.executeQueryAsync(
			success, 
			failed
		);
	}

window.updateListItem2 = function(oListItem, fields, success, failed) {
		Object.keys(fields).forEach(function(key,index) {
			oListItem.set_item(key, fields[key]);
		});	
		oListItem.update();
		ctx.executeQueryAsync(
			success, 
			failed
		);
	}
	
window.updateListItem = function(listTitle, listItemId, fields, success, failed) {
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
		
window.createListItem = function (listTitle, fields, success, failed) {
		var oList = web.get_lists().getByTitle(listTitle);				
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

window.deleteAttachment = function(listTitle, listItemId, fileName, success, failed) {
		var list = web.get_lists().getByTitle(listTitle);
		var file = web.getFileByServerRelativeUrl(String.format('{0}/Attachments/{1}/{2}', list.get_rootFolder().get_serverRelativeUrl(), listItemId, fileName));
		file.deleteObject();
		ctx.executeQueryAsync(
			success,
			failed
		);
	}

window.processUpload = function(fileInput, listTitle, itemId, success, error) {
		var reader = new FileReader();
		reader.onload = function (result) {
			var fileContent = new Uint8Array(result.target.result);
			performAttachmentUpload(listTitle, fileInput.name, itemId, fileContent, success, error);
		};
		reader.readAsArrayBuffer(fileInput);
	}

window.performAttachmentUpload = function(listTitle, fileName, itemId, fileContent, success, error) {
		ensureAttachmentFolder(listTitle,itemId, 
		   function(folder){
			   var attachmentFolderUrl = folder.get_serverRelativeUrl();
			   uploadFile(attachmentFolderUrl, fileName, fileContent, success, error);
		   },
		   error);
	}

window.ensureAttachmentFolder = function(listTitle,itemId, success,error)
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

window.getListItemByMe = function (listTitle, fields, success, failed) {
		var qt = "<Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where>";
		getListItemsByQuery(listTitle, qt, fields, success, failed);
}

window.getListItemByMeStatus = function (listTitle, status, fields, success, failed) {
		var qt = "<Where><And><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq><BeginsWith><FieldRef Name='Status'/><Value Type='Text'>" + status + "</Value></BeginsWith></And></Where>";
		getListItemsByQuery(listTitle, qt, fields, success, failed);
}


window.getListItemByStats = function (listTitle, status, fields, success, failed) {
		var qt = "<Where><BeginsWith><FieldRef Name='Status'/><Value Type='Text'>" + status + "</Value></BeginsWith></Where>";
		getListItemsByQuery(listTitle, qt, fields, success, failed);
}	

window.getListItemByColVal = function (listTitle, colName, colValue, fields, success, failed) {
		var qt = "<Where>" +
			"<Eq><FieldRef Name='" + colName + "'/><Value Type='Text'>" + colValue + "</Value></Eq></Where>";
		getListItemsByQuery(listTitle, qt, fields, success, failed);
}

window.getListItemByColVals = function (listTitle, columns, fields, success, failed) {
		var qs = [];
		Object.keys(columns).forEach(function(key,index) {
			var val = columns[key];
			qs.push ("<Eq><FieldRef Name='" + key + "'/><Value Type='Text'>" + val + "</Value></Eq>")
		});
		var qt = ["<Where>"];
		
		for (var i=0; i<qs.length -1; i++) {
			qt.push("<And>");
		}
		
		for (var i=0; i<qs.length; i++) {
			qt.push(qs[i]);
			if (i>0) qt.push("</And>");
		}
		qt.push("</Where>");
		getListItemsByQuery(listTitle, qt.join(""), fields, success, failed);
}


window.getListItemByColValStats = function (listTitle, colName, colValue, status, fields, success, failed) {
		var qt = "<Where><And><Eq><FieldRef Name='Status'/><Value Type='Text'>" + status + "</Value></Eq>" +
			"<Eq><FieldRef Name='" + colName + "'/><Value Type='Text'>" + colValue + "</Value></Eq></And></Where>";
		getListItemsByQuery(listTitle, qt, fields, success, failed);
}

window.getListItemByGuid1 = function (listTitle, guid, success, failed) {
	var qt = "<Where><And><Eq><FieldRef Name='UniqueId'/><Value Type='Lookup'>" + guid + "</Value></Eq><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></And></Where>";
	var oList = web.get_lists().getByTitle(listTitle);
	var camlQuery = new SP.CamlQuery();
	camlQuery.set_viewXml("<View><Query>" + qt + "</Query><RowLimit>800</RowLimit></View>");
	var oListItem = oList.getItems(camlQuery);	
	ctx.load(oListItem);
	ctx.executeQueryAsync (
		function(){
			if (!success) return;
			var listItemEnumerator = oListItem.getEnumerator();
			while (listItemEnumerator.moveNext()) {
				var item = listItemEnumerator.get_current();
				success(item);
				return;
			}
			success(null);			
		},
	failed);	
}


window.getListItems = function (listTitle, fields, success, failed) {
		var oList = web.get_lists().getByTitle(listTitle);
		var camlQuery = SP.CamlQuery.createAllItemsQuery();
		var oListItem = oList.getItems(camlQuery);
		ctx.load(oListItem);
		
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
						if (f=='UniqueId') {
							oitem[f] = oitem[f].toString();
						} 					}
					results.push(oitem);
				}
				success(results);
			},failed);
	}
	
window.getListItemsByQuery = function (listTitle, queryXML, fields, success, failed) {
		var oList = web.get_lists().getByTitle(listTitle);
		var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View><Query>" + queryXML + "</Query><RowLimit>800</RowLimit></View>");
		var oListItem = oList.getItems(camlQuery);
		if (fields)
		    ctx.load(oListItem, 'Include(' + fields.join(',') + ')');
		else 
			ctx.load(oListItem);
		
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
						if (f=='UniqueId') {
							oitem[f] = oitem[f].toString();
						} 					}
					results.push(oitem);
				}
				success(results);
			},failed);
	}
	
function sendEmail(to, body, subject) {
	var siteurl = _spPageContextInfo.webServerRelativeUrl;
	var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
	parent.$.ajax({
	   contentType: 'application/json',
	   url: urlTemplate,
	   type: "POST",
	   data: JSON.stringify({
	       'properties': {
	           '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
	           'From': "no-reply@sharepointonline.com",
	           'To': { 'results': [to] },
	           'Body': body,
	           'Subject': subject
	       }
	   }
	 ),
	   headers: {
	       "Accept": "application/json;odata=verbose",
	       "content-type": "application/json;odata=verbose",
	       "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value
	   },
	   success: function (data) {
	      console.log("Email done - " + to.join(';'));
	   },
	   error: function (err) {
	       console.log("Error sending email - " + err.responseText);
	   }
	});
}		
	

function startCommunicate() {
	SP.SOD.executeFunc('sp.js', 'SP.ClientContext', initCommunicator);
}
_spBodyOnLoadFunctionNames.push("startCommunicate");
