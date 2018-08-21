var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID
var dbUrl = "mongodb://localhost:27017/";
var nodemailer = require('nodemailer');  //send mail


(function() 
 {
	var fs, http, qs, server, url;
	http = require('http');
	url = require('url');
	qs = require('querystring');
	fs = require('fs');
	
	///var loginStatus = false, loginUser = "";
	///var loginStatus = true; ///assume user has login first
	///loginUser = "ABC";   ///assume user has login first
	
	var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'collkc@gmail.com',
    pass: 'AsiaHK123'
  }
  });

var mailOptions = {
  from: 'collkc@gmail.com',
  to: '2946381574@qq.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};
	
  
	
	
	
	
	server = http.createServer(function(req, res) 
	{
		var action, form, formData, msg, publicPath, urlData, stringMsg;
		var flag, lastlogin;  ///
		urlData = url.parse(req.url, true);
		action = urlData.pathname;
		publicPath = __dirname + "\\public\\";
		//console.log(req.url);
		
		console.log("Received requested URL: " + req.url); //by Colin
		
		//Register website as a new user 
		if (action === "/Signup") 
		{
			console.log("Signup");
			console.log(req.method); ///
			
			if (req.method === "POST") 
			{
		     console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						//user.id = "0";   //login flag
						///flag = "0";   //login flag
						///lastlogin =  new Date();  //login time
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						
						///console.log("Insert1="+stringMsg);  
						///stringMsg = stringMsg + "&" + "flag=" + flag + "&" + "lastlogin=" + lastlogin;   
						///console.log("Insert2="+stringMsg);  
						
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var searchDB = "Name : " + splitName[1];
						console.log("mess="+msg);
						console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("search=" + searchDB);
						///res.writeHead(200, 
						///{
						///	"Content-Type": "application/json",
						///	"Content-Length": msg.length
						///});
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							///dbo.collection("customers").count({"Name" : splitName[1]}, function(err, count)
							dbo.collection("customers").count({"uame" : splitName[1]}, function(err, count)
							///dbo.collection("customers").count({"uame" : splitName[0]}, function(err, count)
							{
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									if(err) throw err;
									console.log("user exist");
									db.close();
									//return res.end("fail");
									return res.end("0");
								}
								else
								{
									dbo.collection("customers").insertOne(myobj, function(err, res) 
									{
										if (err) throw err;
										console.log("1 document inserted");
										db.close();
										//return res.end(msg);
									});
									//return res.end(msg);
									return res.end("1");
								}
							});
						});
					});
				});
				
			} 
			 
			else 
			{

				//form = "login.html";
				form = "register.html";    //Go to register page if not a post action
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		} 
		
		else if( action ==="/newpage")   //?????
		{
			res.writeHead(200, 
			{
				"Content-Type": "text/html"
			});
			return res.end("<h1>welcome to new page</h1><p><a href=\"/Signup\">register</a></p>");
		}

	//Login as a member	
    else if (action === "/Login")
		{
			console.log("login");
			///req.method = "POST";
			console.log(req.method);
			
			if (req.method === "POST") 
			{
			  	console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var tempPassword = splitMsg[1];
						var splitPassword = tempPassword.split("=");
						//var tempLoginTime = splitMsg[2];
						//var splitLogin = tempLoginTime.split("=");
						//var searchDB = "Name : " + splitName[1];
						console.log("mess="+msg);
						console.log("mess="+formData);
						console.log("user=" + splitName[1] + ", password=" + splitPassword[1]);
						//console.log("split=" + msg[1]);
						//console.log("search=" + searchDB);
						//console.log("lastlogin=" + splitLogin[1]);
						///res.writeHead(200, 
						///{
						///	"Content-Type": "application/json",
						///	"Content-Length": msg.length
						///});
						
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							//dbo.collection("customers").count({"Name" : splitName[1], "Password" : splitPassword[1]}, function(err, count)
							//dbo.collection("customers").count({"uame" : splitName[1], "pwd" : splitPassword[1]}, function(err, count)
							dbo.collection("customers").find({"uame" : splitName[1], "pwd" : splitPassword[1]}).toArray(function(err, result)
							{
								
								///console.log(err, count);
								///finalcount = count;
								console.log(err, result);
								finalcount = result;
								if(err) throw err;
								///if(finalcount > 0)
								//if(finalcount != null)
								if(finalcount != "")	
								{
																		
									///loginStatus = true;
									///loginUser = splitName[1];
									
									///console.log("user exist, user is: " + loginUser);
									console.log("login successful, user is: " + splitName[1]);   ///
																		
							        db.close();
								    var resultReturn = JSON.stringify(finalcount);
								    console.log("return: " + resultReturn);
								    return res.end(resultReturn);
						         									
									//return res.end(msg);
									///return res.end("1");
							    }
								else
								{
									db.close();
									var errmsg = "user not found/user or pw not match";
									/// console.log("user or pw not match");
									///return res.end("fail");
									console.log(errmsg);
									//return res.end(errmsg);
									return res.end("");
									///return res.end("0");
								}
							});
						});
					});
				});
			}
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "login.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
       
		}
		
	    //Read favourite list	
	    else if (action === "/readfavourlist")
		{
			///if(!loginStatus)
			///{
			///	console.log("no logged in user found");
			///}
			///else
			///{
				console.log("read favour");
				///loginUser = "hem";   ///assume user has login first
				
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
							var user;
							user = qs.parse(formData);
							msg = JSON.stringify(user);
							stringMsg = JSON.parse(msg);
							var splitMsg = formData.split("&");
						    var tempSplitName = splitMsg[0];
							
						    var splitName = tempSplitName.split("=");
						    
						
						    var username =splitName[1];
						    							
							//var splitMsg = formData.split("=");
							console.log("mess="+msg);
							console.log("mess="+formData);
							console.log("user string="+splitName[1]);
						
						
				    MongoClient.connect(dbUrl, function(err, db) 
				    {
					var finalcount;
					if (err) throw err;
					var dbo = db.db("mydb");
					var myobj = stringMsg;
					//dbo.collection("favourlist").find({"user" : loginUser}, {"_id" : 0, "command" : 1, "texttitle" : 1}).toArray(function(err, result) 
					dbo.collection("favourlist").find({"user" : { $regex: username }}).toArray(function(err, result)
					{
    				if (err) throw err;
    				console.log(result);
    				db.close();
						var resultReturn = JSON.stringify(result);
						console.log(resultReturn);
                        return res.end(resultReturn);
					});
				});
			  });
			});
			///}
			
		}
    
	    //Add favourite list
    	else if (action === "/addfavourlist")
		{
			///if(loginStatus)
			///{
				console.log("add favour item");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
							var user;
							user = qs.parse(formData);
							msg = JSON.stringify(user);
							stringMsg = JSON.parse(msg);
							var splitMsg = formData.split("&");
						    var tempSplitName = splitMsg[0];
						    var tempSplitFavour = splitMsg[1];
							var tempSplitCat = splitMsg[2];	///
							
						    var splitName = tempSplitName.split("=");
						    var splitFavour = tempSplitFavour.split("=");
							var splitCat = tempSplitCat.split("="); ///
						
						    var username =splitName[1];
						    var favorite =splitFavour[1];
							var cat =splitCat[1];   ///
							
							//var splitMsg = formData.split("=");
							console.log("mess="+msg);
							console.log("mess="+formData);
							console.log("user string="+splitName[1]);
							console.log("fav string="+splitFavour[1]);
							console.log("cat string="+splitCat[1]);   ///
							
							res.writeHead(200, 
							{
								"Content-Type": "application/json",
								"Content-Length": msg.length
							});
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								//var myobj = {"user" : loginUser, "favourite" : splitMsg[1]};
								///var myobj = {"user" : username, "favourite" : favorite};
								var myobj = {"user" : username, "favourite" : favorite, "cat" : cat };
								dbo.collection("favourlist").count(myobj, function(err, count)
								{
									console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										if(err) throw err;
										console.log("fav exist");
										db.close();
										//return res.end("fail");
										return res.end("0");  ///
									}
									else
									{
										dbo.collection("favourlist").insertOne(myobj, function(err, res) 
										{
											console.log(err, res);
											if (err) throw err;
											console.log("fav inserted");
											db.close();
										});
										//return res.end(msg);
										return res.end("1");  ///
									}
								});
							});
						});
					});
				}
			///}
			///else
			///{
			///	console.log("no user detected.");
			///}
		}
		
		//Remove favourite list
		else if (action === "/removefavourlist")
		{
			
				console.log("remove favour");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
							var user;
							user = qs.parse(formData);
							msg = JSON.stringify(user);
							stringMsg = JSON.parse(msg);
							
							var splitMsg = formData.split("&");
							var tempSplitName = splitMsg[0];
							var splitName = tempSplitName.split("=");
							var userid=splitName[1];
						
						    //var splitMsg = formData.split("&");
							var tempSplitCat = splitMsg[1];
							var splitCat = tempSplitCat.split("=");
							var favid=splitCat[1];
						
						console.log("Userid="+userid);
						console.log("Catid="+favid);
						
						///console.log("login="+favid);
						
							
							//res.writeHead(200, 
							//{
						//		"Content-Type": "application/json",
						//		"Content-Length": msg.length
						//	});
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								//var myobj = {_id : new ObjectID(favid)};
								var myobj = {user : userid, cat : favid};
								console.log(myobj);
								dbo.collection("favourlist").count(myobj, function(err, count)
								{
									console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										dbo.collection("favourlist").deleteOne(myobj, function(err, res) 
										{
											if (err) throw err;
											console.log("fav removed");
											db.close();
										});
										///return res.end(msg); ///
										return res.end("1");
									}
									else
									{
										if(err) throw err;
										console.log("fav not exist");
										db.close();
										///return res.end("fail");
										return res.end("0");
									}
								});
								
								 dbo.collection("favourlist").find({}).toArray(function(err, result) {
											if (err) throw err;
											console.log(result);
											db.close();
								});
								
								
							});
						});
					});
				}
			
		
		}
		
		//Search required content in favourite list	
	    else if (action === "/Search")
		{
			console.log("search keyword");
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var keyword;
						keyword = qs.parse(formData);
						msg = JSON.stringify(keyword); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
                        console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
                        console.log("split: " + splitMsg[1]);
						/*res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});*/
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							///dbo.collection("textcontent").find({"column" : splitMsg[1]}).toArray(function(err, result)
							dbo.collection("textContent").find({"keytext" : { $regex: splitMsg[1] }}).toArray(function(err, result)
							{
    						if (err) throw err;
    						//console.log("result: " + result);
                            db.close();
								var resultReturn = JSON.stringify(result);
								console.log("return: " + resultReturn);
								return res.end(resultReturn);
							});
																			
						});
					});
				});
			}
			else 
			{
				form = "search.html";                       //load search result page
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		//Reset password, password is set to "123456"	
	    else if (action === "/Reset")
		{
          console.log("reset user's password");
		  
		            ///    transporter.sendMail(mailOptions, function(error, info){
                    ///    if (error) {
					///	console.log(error);
					///	} else {
					///	res.writeHead(200, 
				    ///    {
				    ///    	'Content-Type': 'text/html'
				    ///    });
				    ///    res.write('<b>Reset Password</b><br /><br />This is activation link. Press this: ' + req.url);	
					///	console.log('Email sent: ' + info.response);
					///	}
					///	});
		  
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
                      var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
                        console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
                        console.log("split: " + splitMsg[1]);
						/*res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});*/
						var myobj = {"user" : splitMsg[1]};
												
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							console.log(myobj);
							dbo.collection("customers").count({"uame" : splitMsg[1]}, function(err, count)
							{
								    console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										//dbo.collection("customers").updateOne(myobj, function(err, res) 
										dbo.collection("customers").updateOne({ "uame" : splitMsg[1] }, { $set: { "pwd" : "123456" } }, function(err, res)
										{
											if (err) throw err;
											console.log("result: " + res);
											console.log("Password reset successful");
											db.close();
										});
										return res.end("1"); ///
									}
									else
									{
										if(err) throw err;
										console.log("customer not exist");
										db.close();
										return res.end("0");
									}
								
    						});
    					 
						});
					});
				});
	
		    }
			else 
			{
				form = "forgot-password.html";              //Go to reset password page
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		//Activate the account and update the pssaword after password is reset	
	    else if (action === "/Activation")
		{
          console.log("activate user's password");
		  		  	  
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
                      var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
                        console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
                        console.log("split: " + splitMsg[1]);
						/*res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});*/
										
						
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("customers").count({"uame" : splitMsg[1]}, function(err, count)
							{
								
								console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										dbo.collection("customers").updateOne(myobj, function(err, res) 
										{
											if (err) throw err;
											console.log("result: " + res);
											console.log("Password reset successful");
											db.close();
										});
										return res.end("1"); ///
									}
									else
									{
										if(err) throw err;
										console.log("customer not exist");
										db.close();
										return res.end("0");
									}						
    					
							});
						});
					});
				});
	
		    }
			
		}
		
		//Send feedback to website's administrator and save in database	
	    else if (action === "/Contact")
		{
          console.log("Receive user's feedback");
		  
		    ///  transporter.sendMail(mailOptions, function(error, info){
            ///            if (error) {
			///			console.log(error);
			///			} else {
			///			res.writeHead(200, 
			///	        {
			///	        	'Content-Type': 'text/html'
			///	        });
			///	        res.write('<b>User feedback</b><br /><br />' + req.url);	
			///			console.log('Feedback receive Date/Time: ' + info.response);
			///			}
			///			});
		  
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
                      var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
                        console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
                        console.log("split: " + splitMsg[1]);
						/*res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});*/
						
						//Mapping data
						    var splitMsg = formData.split("&");
							
							var tempSplitName = splitMsg[0];
							var splitName = tempSplitName.split("=");
							var user=splitName[1];
						
							var tempSplitEmail = splitMsg[1];
							var splitEmail = tempSplitEmail.split("=");
							var email=splitEmail[1];
						
							var tempSplitPhone = splitMsg[2];
							var splitPhone = tempSplitPhone.split("=");
							var phone=splitPhone[1];
						
							var tempSplitMessage = splitMsg[3];
							var splitMessage = tempSplitMessage.split("=");
							var message=splitMessage[1];
						
						console.log("User="+user);
						console.log("Email="+email);
						console.log("Phone="+phone);
						console.log("Message="+message);
						
						
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("feedback").insertOne(myobj, function(err, result)
							{
    						if (err) throw err;
    						//console.log("result: " + result);
                            db.close();
								var resultReturn = JSON.stringify(result);
								console.log("return: " + resultReturn);
								return res.end(resultReturn);
							});
						});
					});
				});
	
		    }
			else 
			{
				form = "contact.html";                       //load contact page
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}


		}
				
		
        //Check login	
	    else if (action === "/Checklogin")
		{        
		       console.log("Check Login Status");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
                      var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
                        console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
                        console.log("split: " + splitMsg[1]);
						/*res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});*/
										
						
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("customers").find({"uame" : splitMsg[1]}).toArray(function(err, result)
							{
    						  		console.log(err, result);
									if (err) throw err;
									var resultReturn = JSON.stringify(result);
									finalcount = result;
									
									//if(finalcount > 0)
									if(finalcount != null)	
									{
									     db.close();
								         console.log("return: " + resultReturn);
										 console.log("Check Login Success");
								         return res.end(resultReturn);
									}
									else
									{
										console.log("User not found");
										db.close();
										return res.end(resultReturn);
									}
							  							   
							});
							
						   });
					});
				});
			
		}
		
		//Update login	
	    else if (action === "/UpdateLogin")
		{        
		       console.log("Update Login Status");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
                        var user;
					    var lastlogin;
						user = qs.parse(formData);
						msg = JSON.stringify(user); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
                        console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
                        console.log("split: " + splitMsg[1]);
						/*res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});*/
						
						// make timestamp 
						var currentDate =  new Date();  //login time
						///alert("Current Date:" + currentDate); 
						var year = currentDate.getFullYear();
						///alert("Year:" + year); 
						var month = currentDate.getMonth();
						///alert("Month:" + month); 
						var day = currentDate.getDate();
						///alert("Day:" + day); 
						var hour = currentDate.getHours();
						///alert("Hour:" + hour); 
						var minute = currentDate.getMinutes();
						///alert("Minute:" + minute); 
						var second = currentDate.getSeconds();
						///alert("Second:" + second); 
						var lastlogin =  year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second;
						///alert("Time Stamp:" + timestamp); 
									
						
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							
							dbo.collection("customers").updateOne( { "uame" : splitMsg[1] }, { $set: { "flag" : 1 , "lastlogin" : lastlogin } }, function(err, result) 
							{
    						  		console.log(err, result);
									if (err) throw err;
									var resultReturn = JSON.stringify(result);
									finalcount = result;
									console.log("count: " + finalcount);
									//if(finalcount > 0)
									if(finalcount != null)	
									{
									     db.close();
								         console.log("User status updated success.");
										 console.log("return: " + resultReturn);
								         return res.end(resultReturn);
									}
									else
									{
										console.log("User status updated fail.");
										db.close();
										return res.end(resultReturn);
									}
							  							   
							});
							
						});
					});
				});
			
		}
				
		
		else if (action === "/Logout")	
		{				
			  	console.log("Logout Process");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						
						
						console.log("mess="+msg);
						console.log("mess="+formData);
						console.log("user=" + splitMsg[1]);
						
						///res.writeHead(200, 
						///{
						///	"Content-Type": "application/json",
						///	"Content-Length": msg.length
						///});
						
						MongoClient.connect(dbUrl, function(err, db) 
						{
							//var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							//dbo.collection("customers").count({"Name" : splitName[1], "Password" : splitPassword[1]}, function(err, count)
							///dbo.collection("customers").count({"uame" : splitMsg[1]}, function(err, count)
							///{
								///console.log(err, count);
								///finalcount = count;
								///if(err) throw err;
								///if(finalcount > 0)
								///{
									dbo.collection("customers").updateOne( { "uame" : splitMsg[1] }, { $set: { "flag" : 0 } }, function(err, result) 
									{
										//finalcount = result;
										console.log(err, result);
										if (err) throw err;
										console.log("logout flag updated");
										db.close();
										return res.end("1");
									});
									
									///loginStatus = false;
									///loginUser = "";
									
									console.log("logout successful, user is: " + splitMsg[1]);   ///
									db.close();
								
								///}
								///else
								///{
								///	db.close();
								///	var errmsg = "user not found";
								///	console.log(errmsg);
								///	return res.end(errmsg);
								///}
								    ///return res.end("0");
									
							///});
						});
					});
				});

		
	    }
		
		
		
		
		else 
		{
             //handle redirect request
			if(req.url === "/index")
			{
				 
               //if(loginStatus)
				//{
					//sendFileContent(res, "login.html", "text/html");
				//}
				//else
				//{
					//sendFileContent(res, "client.html", "text/html");
                //}
				
				sendFileContent(res, "index.html", "text/html");
				
			}
			else if (req.url === "/signuppage")
			{
				//sendFileContent(res, "signuppage.html", "text/html");
				sendFileContent(res, "register.html", "text/html");
			}
			else if (req.url === "/loginpage")   //get login info
			{
				//sendFileContent(res, "loginpage.html", "text/html");
				sendFileContent(res, "login.html", "text/html");
										
			}
			//else if (req.url === "/logout")
			///else if (req.url === "/Logout")	
			///{
				//reset parameters, go back to Home Page
			///	loginStatus = false;
			///	loginUser = "";
				///sendFileContent(res, "index.html", "text/html");
				///return res.end;
			///}
			else if (req.url === "/hklawprivacy")
			{
				sendFileContent(res, "privacy.html", "text/html");
			}
			else if (req.url === "/aboutpage")
			{
				sendFileContent(res, "about.html", "text/html");
			}
            else if (req.url === "/protectdata")
			{
				sendFileContent(res, "term.html", "text/html");
			}
            else if (req.url === "/socialnetwork")   //social network login
			{
				sendFileContent(res, "socialnetwork.html", "text/html");
			}
            else if (req.url === "/favlistpage")
			{
				sendFileContent(res, "favourite.html", "text/html");
			}
			else if (req.url === "/healthpage")
			{
				sendFileContent(res, "health.html", "text/html");
			}
            else if (req.url === "/contactpage")
			{
				sendFileContent(res, "contact.html", "text/html");
			}
			else if (req.url === "/aboutpage")
			{
				sendFileContent(res, "about.html", "text/html");
			}
			else if(req.url === "/")
			{
				console.log("Requested URL is url" + req.url);
				
				///res.writeHead(200, 
				///{
				///	'Content-Type': 'text/html'
				///});
				///res.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + req.url);
			
			    sendFileContent(res, "index.html", "text/html"); //BY Colin 
			}
			else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
		    else if(/^\/[a-zA-Z0-9\/]*.min.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}	
			else if(/^\/[a-zA-Z0-9\/]*.bundle.min.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
			else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
			else if(/^\/[a-zA-Z0-9\/]*.min.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
			else if(/^\/[a-zA-Z0-9\/]*.bundle.min.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
			else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/jpg");
			}
            else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/png");
			}
			else if(/^\/[a-zA-Z0-9\/]*.gif$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/gif");
			}
			else
			{
				console.log("Requested URL is: " + req.url);
				res.end();
			}

		}
	});

	server.listen(8080);      //local server
	
	//server.listen(9000);    //codeanywhere

	console.log("Server is running�Atime is" + new Date());


	function sendFileContent(response, fileName, contentType)
	{
		fs.readFile(fileName, function(err, data)
		{
			if(err)
			{
				response.writeHead(404);
				response.write("Not Found!");
			}
			else
			{
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data);
			}
			response.end();
		});
	}
	
 }).call(this);
