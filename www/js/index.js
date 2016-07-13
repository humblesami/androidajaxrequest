var app = {
    // Application Constructor
    initialize: function () {
        app.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    onDeviceReady: function () {             
        capp.bindEvents();
        fw.createFile('volunteers.csv', function () {                        
        });
    }
};

var validation = {
    apply: function (){

    }
};

var capp = {
    headers: 'FirstName,LastName,Gender,Age,CellPhone,Email,Company,Employee,Organization,Event',
    bindEvents: function () {
        validation.apply();        
        $('form').find('input[type!="hidden"]').addClass('pat');
        $('div.submit').show();
        $('#btnAutoFill').click(function () {
            var employee = $("#employee").val('sami@live.com');
            var org = $("#org").val('org4');
            var evt = $("#event").val('event3');
            
            var email = $("#v_email").val('hello@yahoo.com');
            var f_name = $("#vf_name").val('Sami');
            var l_name = $("#vl_name").val('Akram');
            var gender = $("input[name='v_gender']").val('Male');
            var age = $("#age").val('30');
            var cell = $("#cell").val('3335555');
            var company = $("#company").val('zong');
        });
        
        function requestBegin()
        {
            $('.submit').hide();
        }
        function requestComplete(){
            $('.submit').show();
        }

        //$('#deviceready').html('Device Is Ready');
        fw.headers = capp.headers;
        $('#fileDel').click(function () {            
            if (!confirm("Are you sure you want to permanently delete the volunteer data from this device? Once deleted, you will not be able to recover this data."))
                return;
			capp.showSuccessMessage("Checking backup and removing file");
            requestBegin();
            $.ajax({
                url: 'http://epledge.uwmb.org:8102/fileDelete',
                data: { email: $('#employee').val() },
                success: function (data) {
                    if (data.toString().indexOf('error') > -1) {
                        capp.showErrorMessage("Please first share latest on email. Your file has been changed since you last shared it on email");
                        requestComplete();
                        return;
                    }
                    var callback = function (fileText) {
                        data = data.replace(/\s+/g, '');
                        fileText = fileText.replace(/\s+/g, '');
                        if (data != fileText) {
                            capp.showErrorMessage("Please first share latest on email. Your file has been changed since you last shared it on email");
                        }
                        else {
                            fw.clearFile(function () {                                
								capp.showSuccessMessage("File has been removed");								
                            });                            
                        }
                    };
                    fw.readFile(callback);
					requestComplete();
                },
                error: function (a) {
                    capp.showErrorMessage(a.responseText);
                }
            });
        });

        $('#btnViewFormData').click(function () {
            
            $('#lb_fname').html($("#vf_name").val());
            $('#lb_lname').html($("#vl_name").val());
            $('#lb_email').html($("#v_email").val());
            $('#lb_gender').html($("input[name='v_gender']").val());
            $('#lb_age').html($("#age").val());
            $('#lb_phone').html($("#cell").val());
            $('#lb_company').html($("#company").val());
            
            $('#volunteerdata').hide();
            $('#volunteerdataview').show();
        });

        $('#btnGoToInputForm').click(function () {
            $('#volunteerdataview').hide();
            $('#volunteerdata').show();            
        });
        $('.reset').click(function (event) {
            event.preventDefault();
            $(this).closest("form").find('input').val('');
        });
        
        $("#logout").click(function () {
            $('#login :input[type = "text"],input[type = "email"]').val('');
            $('#volunteerdata :input[type = "text"],input[type = "email"],input[type = "number"],input[type = "tel"]').val('');
            $('#login').show();
            $('#volunteerdata').hide();    
        
        });
        $('#fileViewButton').click(function () {
            requestBegin();
            var callback = function (fileText) {
                if (!fileText)
                    $('#preparedFileText').val("File is empty yet");
                else
                    $('#preparedFileText').val(fileText);
                requestComplete();
            };
            fw.readFile(callback);            
        });

        $('#fileShareButton').click(function () {
            requestBegin();           
            fw.readFile(function (fileText) {
                if (!fileText) {
                    capp.showErrorMessage("File is empty yet");
                    requestComplete();
                    return;
                }
                capp.showSuccessMessage("Data Being Sent...", 0);
                sendEmail(fileText);
            });
        });
        

        function sendEmail(fileText)
        {
            var employeeEmail=$("#employee").val();
                     
            /*$.ajax({
                url: 'http://epledge.uwmb.org:8102/email',
                data: { data: fileText, email: employeeEmail },
                success: function () {
                    capp.showSuccessMessage("Data Sent Successfully");
                    requestComplete();
                },
                error: function (a) {
                    capp.showErrorMessage("Error:" + a.responseText);
                    requestComplete();
                }
            });*/
			
			$.ajax
			({
				  url: 'https://randomuser.me/api/',
				  dataType: 'json',
				  success: function(data){
					  capp.showSuccessMessage("Done");					  
					  requestComplete();
				  },
				  error: function(data){
					  capp.showErrorMessage("Not Done");					  	 
					  requestComplete();
				  }
			});
        }
        
        $('#login').submit(function (event) {
            event.preventDefault();
            if (!isFormValid())
                return;
            $('#login').hide();
            $('#volunteerdata').show();
        });
        $('#volunteerdata').submit(function (event) {            
            event.preventDefault();
            if (!isFormValid())
                return;
			if(!$('#agreed').prop('checked'))
			{
				capp.showErrorMessage("Please Check the Agreement CheckBox");
				return;
			}
            var form = this;
            requestBegin();
            var employee = $("#employee").val();
            var org = $("#org").val();
            var evt = $("#event").val();

            var email = $("#v_email").val();
            var f_name = $("#vf_name").val();
            var l_name = $("#vl_name").val();
            var gender = $("input[name='v_gender']").val();
            var age = $("#age").val();
            var cell = $("#cell").val();
            var company = $("#company").val();
            var data = '"' + f_name + '","' + l_name + '","' + gender + '","' + age + '","' + cell + '","' + email + '","' + company + '","' + employee + '","' + org + '","' + evt + '"';
            fw.writeFile(data, true, function () {
                requestComplete();
                capp.showSuccessMessage("Data Submitted Successfully");
                form.reset();
            });            
        });   
    },
    
    showSuccessMessage: function (mesg, interval) {
        $('#successmessage').html(mesg).show();
        if (interval != 0) {
            interval = 2000;
            setTimeout(function () {
                $('#successmessage').html("").hide();
            }, interval);
        }
    },
    
    showErrorMessage: function (mesg, interval) {
        $('#successmessage').hide();
        $('#errormessage').html(mesg).show();        
        if (interval != 0) {
            interval = 4000;
            setTimeout(function () {
                $('#errormessage').html("").hide();
            }, interval);
        }
    },

    writeData: function (data) {
        if (!data)
            data = 'Hi,Hello';
        data += '\n"1","2"';
        data += '\n3"","4"';
        fw.writeFile(data);        
    }
};

var fw = {
    headers:'',
    fileEntry: null,
    fileWriter: null,
    
    onErrorLoadFs: function (a) {
        console.log(a);
    },

    createFile: function (fileName, callback) {
        var size = 5 * 1024 * 1024;
        //window.PERSISTENT
        //1
        //LocalFileSystem.PERSISTENT
        // Creates a new file or returns the file if it already exists.        
        //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, size,      
        window.requestFileSystem(1, 0, function (fs) {
             
            fs.root.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                fw.fileEntry = fileEntry;
                fileEntry.createWriter(function (fileWriter) {                    
                    fileWriter.onwriteend = function () {
                        fw.readFile();
                        
                    };
                    fileWriter.onerror = function (e) {
                        console.log("Failed file read: " + e.toString());
                    };
                    fw.fileWriter = fileWriter;
                    if (callback) {
                        callback();
                    }
                });
            }, fw.onErrorCreateFile);
        }, fw.onErrorLoadFs);
    },

    onErrorCreateFile:function(a)
    {
        console.log("Issue in file create");
        console.log(a);        
    },

    writeFile: function (dataObj, isAppend, callback) {
        try {
            var contentLength = fw.fileWriter.length;            
            if (contentLength == 0) {                
                if (fw.headers.length == 0) {
                    alert("headers are not set");
                    return;
                }
                
                fw.fileWriter.write(fw.headers + "\n" + dataObj);
            }
            else {                
                if (isAppend) {
                    fw.fileWriter.seek(contentLength);
                    dataObj = "\n" + dataObj;
                }
                fw.fileWriter.write(dataObj);
            }
        }
        catch (e) {
            alert("error");
            console.log(e);
        }
        if (callback)
            callback();
    },

    readFile: function (callback) {
        fw.fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function () {                
                if (callback)
                    callback(this.result);
            };
            reader.readAsText(file);           
        }, fw.onErrorReadFile);
    },

    onErrorReadFile: function (error) {
        alert("ERROR: " + error.code)
    }
    ,
    clearFile: function (callback) {
        fw.fileEntry.remove(function () {
            fw.createFile('volunteers.csv', function () {            
                if (callback)
                    callback();
            });
        }, fw.errorCallback);
    }
};
app.initialize();