//For Transactions between Customer and Provider
testPlans = "TestPlans"; // avoid typos, this string occurs many times.
TestPlans = new Mongo.Collection(testPlans);

TestPlans.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    },
});

Meteor.methods({
    /**
     * Invoked by autoform to add a new Ride Data record.
     * @param doc The TestPlans document.
     */
    addTestPlan: function(doc) {
        console.log("Adding", doc);
        check(doc, TestPlans.simpleSchema());
        TestPlans.insert(doc, function(err, docID) {
            if (typeof docID !== "undefined") {
                var patient = TestPlans.findOne({
                    _id: docID
                }).patient;
                var providerName = TestPlans.findOne({
                    _id: docID
                }).provider;
                var providerSpark = TestPlans.findOne({
                    name: providerName
                }).sparkid;
                var patientName = TestPlans.findOne({
                    _id: docID
                }).patient;
                var patientAdd = Customer.findOne({
                    name: patientName
                }).address;
                var patientCity = Customer.findOne({
                    name: patientName
                }).city;
                var patientSt = Customer.findOne({
                    name: patientName
                }).state;
                var patientZip = Customer.findOne({
                    name: patientName
                }).zip;
                var date = TestPlans.findOne({
                    _id: docID
                }).date;
                var message = "Special Needs person requires a lift!: \n" + patient + "\n" + date + "\n" + patientAdd + "\n" + patientCity + " " + patientSt + "\n" + patientZip;
                var googleApiKey = "AIzaSyCki3ZyudDc--brJmAbjP_zV7TtUj8iPrs";
                var googleApi = "https://maps.googleapis.com/maps/api/staticmap?center=";
                var addPlus = patientAdd.split(' ').join('+');
                console.log("thisplus: " + addPlus);
                var file = googleApi + addPlus + "+" + patientZip + "&zoom=14&size=400x400&key=" + googleApiKey;
                Meteor.call(
                    'sparkMsg',
                    providerSpark,
                    message,
                    function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {}
                    }
                ) //sparkMsg
                Meteor.call(
                    'sparkMsgMap',
                    providerSpark,
                    file,
                    function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {}
                    }
                ) //sparkMsgMap


            } else {
                console.log("dang, didn't work")
            }
        });
    }, //addRideData
    /**
     *
     * Invoked by autoform to update a Ride Data record.
     * @param doc The TestPlans document.
     * @param docID It's ID.
     */
    updateTestPlan: function(doc, docID) {
        console.log("Updating", doc);
        check(doc, TestPlans.simpleSchema());
        TestPlans.update({
            _id: docID
        }, doc);
    },
    addComments: function(projectId, testId, comments) {

      TestPlans.update({_id: projectId, "test.id": testId}, {$set: {"test.$.comments": comments}});
    },
    answerPass: function(testId, expected) {
      TestPlans.update({
          "_id": testId,
          "test.expected": expected
      }, {
          $set: {
              "test.$.pass": true
          }
      });
      TestPlans.update({
          "_id": testId,
          "test.expected": expected
      }, {
          $set: {
              "test.$.fail": false
          }
      });
        var numQuestions = TestPlans.findOne({
            "_id": testId
        }).numQuestions;
        var tests = TestPlans.find({
            "_id": testId,
            "test.expected": expected
        }).fetch()
        var questions = tests[0].test;
        var count = 0;

       for (i = 0; i < numQuestions; i++) {
            if (questions[i].pass == true || questions[i].fail == true) {
                count++;
            } else {}
        }
        var progress = (count / numQuestions) * 100;
        if (progress === 100) {
            TestPlans.update({
                "_id": testId
            }, {
                $set: {
                    "status": "Complete"
                }
            });
        } else {
            TestPlans.update({
                "_id": testId
            }, {
                $set: {
                    "status": "In Progress"
                }
            });
        }
        TestPlans.update({
            "_id": testId
        }, {
            $set: {
                "progress": progress
            }
        });
    },
    answerFail: function(testId, expected) {
      TestPlans.update({
          "_id": testId,
          "test.expected": expected
      }, {
          $set: {
              "test.$.fail": true
          }
      });
      TestPlans.update({
          "_id": testId,
          "test.expected": expected
      }, {
          $set: {
              "test.$.pass": false
          }
      });
        var numQuestions = TestPlans.findOne({
            "_id": testId
        }).numQuestions;
        var tests = TestPlans.find({
            "_id": testId,
            "test.expected": expected
        }).fetch()
        var questions = tests[0].test;
        var count = 0;
        for (i = 0; i < numQuestions; i++) {
             if (questions[i].pass == true || questions[i].fail == true) {
                 count++;
             } else {}
         }
         var progress = (count / numQuestions) * 100;
        TestPlans.update({
            "_id": testId
        }, {
            $set: {
                "progress": progress
            }
        });
    },
    comments: function(testId, comments) {
        //    console.log("answercomments");
//        TestPlans.update({
//            "_id": testId,
//            "test.expected": expected
//        }, {
//            $set: {
//                "test.$.comments": comments
//            }
//        });
          TestPlans.update({"_id": testId}, {$set: {"comments": comments}});
    },
    genAndDownloadPdf: function(testId, projectId, comments, engSignature, custSignature, clientIp) {
//      console.log(clientIp);
        var projectCode = projectId;
        var companyName = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.companyName;
        });
        var sections = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.sections;
        });
        var engineerName = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.engineerName;
        });
        var engineerEmail = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.engineerEmail;
        });
        var engineerTitle = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.engineerTitle;
        });
        var projectManagerName = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.projectManagerName;
        });
        var projectManagerEmail = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.projectManagerEmail;
        });
        var customerName = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.customerName;
        });
        var customerEmail = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.customerEmail;
        });
        var thisDate = TestPlans.find({
            _id: testId
        }).map(function(i) {
            return i.createdAt;
        });
        // Define the pdf-document
        var docDefinition = {
            content: [
              {
                  image: 'data:image/png;base64,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',
                  width: 250
              },
              {
                  image:
                  'data:image/png;base64,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',
                  width: 240
              },
              {
                    stack: [
                        companyName,
                        {
                            text: projectCode + '\n' + sections + '\nCertificate of Testing Completion\n' + thisDate,
                            style: 'subheader'
                        }
                    ],
                    style: 'header'
                },
                {
                    columns: [{
                            width: '33%',
                            text: 'Lead Engineer:',
                            style: 'header2b'
                        },
                        {
                            width: '33%',
                            text: 'Project Manager:',
                            style: 'header2b'
                        },
                        {
                            width: '33%',
                            text: 'Customer:',
                            style: 'header2b'
                        }
                    ]
                },
                {
                    columns: [{
                            width: '33%',
                            text: engineerName + '\n' + engineerEmail,
                            style: 'header2'
                        },
                        {
                            width: '33%',
                            text: projectManagerName + '\n' + projectManagerEmail,
                            style: 'header2'
                        },
                        {
                            width: '33%',
                            text: customerName + '\n' + customerEmail,
                            style: 'header2'
                        }
                    ]
                },
                {text: comments, style: 'commentMargin'},
                {text: '*All tasks in the Test Plan document have been successfully completed and any discrepancies are noted above.', style: 'lawyerspeak'},
//                {text: clientIp, style: 'lawyerspeak'},
                {
                    image: engSignature,
                    width: 350
                },
                engineerName,
                clientIp,
                {
                    image: custSignature,
                    width: 350
                },
                customerName,
                clientIp
            ],


            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 90, 0, 40]
                },
                header2: {
                    fontSize: 12,
                    alignment: 'right',
                    margin: [0, 0, 0, 20]
                },
                header2b: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 0, 0, 0]
                },
                footerleft: {
                    alignment: 'left',
                    margin: [0, 20, 0, 0]
                },
                footerright: {
                    alignment: 'right',
                    margin: [0, 20, 0, 0]
                },
                subheader: {
                    fontSize: 12
                },
                lawyerspeak: {
                    fontSize: 10,
                    italic: true
                },
                superMargin: {
                    margin: [20, 0, 40, 0],
                    fontSize: 12
                },
                commentMargin: {
                    margin: [0, 40, 0, 40],
                    fontSize: 12
                },
                testQuestions: {
                    italic: true,
                    alignment: 'right'
                },
                defaultStyle: {
                    columnGap: 20
                }
            }
        };
        // Start the pdf-generation process


        TestPlans.update({'_id': testId}, {$set: {'pdf': docDefinition}});
        TestPlans.update({'_id': testId}, {$set: {'hasPdf': true}});

        var pdfDoc = TestPlans.findOne({'_id': testId}).pdf;
        var myPdf = pdfMake.createPdf(pdfDoc).open();
    },
    downloadPdf: function(testId){
      if (typeof testId !== 'undefined'){
      var pdfDoc = TestPlans.findOne({'_id': testId}).pdf;
      var companyName = TestPlans.findOne({'_id': testId}).companyName;
      var projectCode = TestPlans.findOne({'_id': testId}).project;
      var fileName = companyName+"-"+projectCode+"-TP.pdf";
      var myPdf = pdfMake.createPdf(pdfDoc).download(fileName);
      }
    },
    assignUser: function(id, result){
      TestPlans.update({_id: id}, { $push: {assigned: result}});
    },
});

// Publish the entire Collection.  Subscription performed in the router.
if (Meteor.isServer) {
    Meteor.publish("TestPlans", function() {
        return TestPlans.find();
    });
}

/**
 * Create the schema for Ride Data.
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
//SimpleSchema.debug = true;
TestPlans.attachSchema(new SimpleSchema({
    project: {
        label: "Project",
        type: String,
        optional: true,
        autoform: {}
    },
    region : {
      type: String,
      optional: true,
    },
    engineerName: {
        type: String,
        optional: true,
    },
    engineerTitle: {
        type: String,
        optional: true,
    },
    engineerEmail: {
        label: "EngineerEmail",
        type: String,
        optional: true,
        autoform: {}
    },
    createdAt: {
        type: Date,
        autoValue() { // eslint-disable-line consistent-return
            if (this.isInsert) {
                return new Date();
            } else {
                this.unset();
            }
        },
    },
    numQuestions: {
        type: Number,
        optional: true,
        min: 0,
    },
    status: {
        type: String,
        optional: true,
    },
    progress: {
        type: String,
        optional: true,
    },
    technology: {
        type: String,
        optional: true,
    },
    technologyLabel: {
        type: String,
        optional: true,
    },
    sections: {
        type: String,
        optional: true,
    },
    sparkId: {
      type: String,
      optional: true,
    },
    assigned: {
      type: [String],
      optional: true,
    },
    projectManagerName: {
        label: "ProjectManagerName",
        type: String,
        optional: true,
        autoform: {}
    },
    projectManagerEmail: {
        label: "ProjectManagerEmail",
        type: String,
        optional: true,
        autoform: {}
    },
    companyName: {
        label: "CompanyName",
        type: String,
        optional: true,
        autoform: {

        }
    },
    customerName: {
        label: "CustomerName",
        type: String,
        optional: true,
        autoform: {

        }
    },
    customerEmail: {
        label: "CustomerEmail",
        type: String,
        optional: true,
        autoform: {}
    },
    isCompleted: {
      type: Boolean,
      optional: true,
    },
    pdf: {
      type: Object,
      optional: true,
      blackbox: true,
    },
    hasPdf: {
      type: Boolean,
      optional: true,
    },
    comments: {
      type: String,
      optional: true,
    },
    "test.$": {
        type: Object,
    },
    "test.$.section": {
        label: "Section",
        type: String,
        optional: true,
    },
    "test.$.id": {
        label: "id",
        type: String,
        optional: true,
    },
    "test.$.technology": {
        label: "Technology",
        type: String,
        optional: true,
    },
    "test.$.description": {
        label: "Description",
        type: String,
        optional: true,
    },
    "test.$.instructions": {
        label: "Instructions",
        type: String,
        optional: true,
    },
    "test.$.expected": {
        label: "Expected Result",
        type: String,
        optional: true,
    },
    "test.$.actual": {
        label: "Actual Result",
        type: String,
        optional: true,
    },
    "test.$.pass": {
        type: Boolean,
        optional: true,
        autoform: {
            type: "boolean-radios",
            value: false
        },
    },
    "test.$.fail": {
        type: Boolean,
        optional: true,
        autoform: {
            type: "boolean-radios",
            value: false
        },
    },
    "test.$.comments": {
        label: "Comments",
        type: String,
        optional: true,
    },
}));
