/*
POSTMAN GALAXY APIs 101

This API works in conjunction with the Postman Galaxy APIs 101 collection in Postman to walk you through API basics.
Import the collection into Postman from the workspace shared during the session and send a request to the setup endpoint to begin.


This Glitch app is based on hello-express and low-db.

Below you'll see the code for the endpoints in the API after some initial setup processing
  - each endpoint begins "app." followed by get, post, patch, put, or delete, then the endpoint path, e.g. /cat
*/

/*
response structure:

{
    welcome:
      "Welcome! Check out the 'data' object below to see the values returned by the API. Click **Visualize** to see the 'tutorial' data " +
      "for this request in a more readable view.",
    data: {
      cat: {
        name: "Syd",
        humans: 9
      }
    },
    tutorial: {
      title: "You did a thing! 🚀",
      intro: "Here is the _intro_ to this **lesson**...",
      steps: [
        {
          note: "Here is a step with `code` in it...",
          pic:
            "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg",
          raw_data: {
            cat: {
              name: "Syd",
              humans: 9
            }
          }
        }
      ],
      next: [
      {
        step: "Now do this...",
        pic:
          "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg",
        raw_data: {
          cat: {
            name: "Syd",
            humans: 9
          } 
        }
      }
      ]
    }
  }
*/

// server.js
// where your node app starts

const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup a new database persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);
const shortid = require("shortid");
//email validation
var validator = require("email-validator");
var faker = require("faker");

// default list
var defaultCustomers = [
  {
    id: shortid.generate(),
    admin: "postman",
    adminuid: "abc123",
    name: "Ellen Ripley",
    address:
      faker.address.streetAddress() +
      ", " +
      faker.address.city() +
      ", " +
      faker.address.country(),
    type: "individual",
    orders: 2
  },
  {
    id: shortid.generate(),
    admin: "postman",
    adminuid: "abc123",
    name: "Thomas Kane",
    address:
      faker.address.streetAddress() +
      ", " +
      faker.address.city() +
      ", " +
      faker.address.country(),
    type: "individual",
    orders: 99
  },
  {
    id: shortid.generate(),
    admin: "postman",
    adminuid: "abc123",
    name: "USCSS Nostromo",
    address:
      faker.address.streetAddress() +
      ", " +
      faker.address.city() +
      ", " +
      faker.address.country(),
    type: "organization",
    orders: 10
  }
];
db.defaults({
  customers: defaultCustomers,
  calls: []
}).write();

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /",
      what: req.get("csm_key")
    })
    .write();
  if (req.headers["user-agent"].includes("Postman"))
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: process.env.PROJECT,
        intro:
          "Use the " +
          process.env.PROJECT +
          " collection in Postman to learn API basics! " +
          "To see the API code navigate to https://glitch.com/edit/#!/" +
          process.env.PROJECT_DOMAIN +
          " in your web browser!"
      }
    });
  else
    res.send(
      "<h1>" +
        process.env.PROJECT +
        "</h1><p>Oh, hi! There's not much to see here - view the code instead:</p>" +
        '<script src="https://button.glitch.me/button.js" data-style="glitch"></script><div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>'
    );
});

//generic welcome message
var welcomeMsg =
  "You're using the " +
  process.env.PROJECT +
  " course! Check out the 'data' object below to see the values returned by this API request. " +
  "Click **Visualize** to see the 'tutorial' guiding you through next steps - do this for every request in the collection!";
//admin unauthorized
var unauthorizedMsg = {
  welcome: welcomeMsg,
  tutorial: {
    title: "Your request is unauthorized! 🚫",
    intro: "This endpoint requires admin authorization.",
    steps: [
      {
        note: "This endpoint is only accessible to admins for the API."
      }
    ],
    next: [
      {
        step: "Use the admin key indicated in the project env as secret."
      }
    ]
  }
};
//invalid route
var invalidMsg = {
  welcome: welcomeMsg,
  tutorial: {
    title: "Your request is invalid! 🚧",
    intro:
      "Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left of Postman."
  }
};

//intro
app.get("/begin", (req, res) => { 
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /begin",
      what: req.get("csm_key")
    })
    .write();
  res.status(200).json({
    welcome: welcomeMsg,
    data: {
      course: process.env.PROJECT
    },
    tutorial: {
      title: "Welcome to " + process.env.PROJECT + "! 🚀",
      intro:
        "You sent a successful request to the API! Throughout this course you will send requests, carry out edits in Postman, and the API " +
        "will respond with information that will help you complete each step.",
      steps: [
        {
          note:
            "Take a minute to look at the request you sent. This request used the `GET` method, which is typically for retrieving data. " +
            "You sent the request to an address, which is a URL, just like when you open a web page. The address includes a **base** URL " +
            "`" +
            process.env.PROJECT_DOMAIN +
            ".glitch.me` and a **path** `/begin`."
        },
        {
          note:
            "The request you sent to the training API received a response including this data, which is structured in JSON:",
          raw_data: {
            course: process.env.PROJECT
          }
        },
        {
          note:
            "Each response you receive back from this API will include JSON data that you can see in the **Body > Pretty** area of Postman. " +
            "The **Visualize** view will show you a more readable view of the information in the response `tutorial`."
        },
        {
          note:
            "Although we will be dealing with JSON data, you do not need to know the syntax. In this case `course` is a " +
            "**Property** which has `" +
            process.env.PROJECT +
            "` as its **Value**. The property is inside an **Object**, indicated by the curly " +
            "braces. `{}`."
        }
      ],
      next: [
        {
          step:
            "Take a look at the information above the response area, particularly the **200 OK**. This is the status code–a number and short " +
            "text string indicating the success or failure of the request. Hover over it for more info. Soon " +
            "we will encounter other codes, including unsuccessful ones.. 😱"
        },
        {
          step:
            "For this course we will be using a fake database for managing customer records. Open the next request in the collection: " +
            "`Get customers` and click **Send**."
        }
      ]
    }
  });
});

app.get("/customers", (req, res) => {
  
  const apiSecret = req.get("csm_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /customers",
      what: req.query.status + " " + apiSecret
    })
    .write();
  //TODO min without type
  var minimum = 0;
  var invalidMin = isNaN(parseInt(req.query.min)) ? true : false;
  if (!invalidMin) minimum = parseInt(req.query.min);
  if (req.query.type || req.query.min) {
    var customers;
    if (
      !req.query.min &&
      !["organization", "individual"].includes(req.query.type)
    ) {
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro: "'type' must be `organization` or `individual`!",
          steps: [
            {
              note:
                "Open **Params** and enter `organization` or `individual` as the **Value** for the parameter with `type` as the **Key**. " +
                "You will see the query parameter added to the end of the request address e.g. `/customers?type=individual`."
            }
          ],
          next: [
            {
              step:
                "With a valid parameter value in place, click **Send** again."
            }
          ]
        }
      });
    } else if (req.query.min && invalidMin) {
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro: "'min' must be a number!",
          steps: [
            {
              note:
                "Open **Params** and enter a number as the **Value** for the parameter with `min` as the **Key**. " +
                "You will see the query parameter added to the end of the request address e.g. `/customers?min=5`."
            }
          ],
          next: [
            {
              step:
                "With a valid parameter value in place, click **Send** again."
            }
          ]
        }
      });
    } else if (req.query.type) {
      customers = db
        .get("customers")
        .filter(o => o.type === req.query.type)
        .filter(o => o.orders >= minimum)
        .filter(o => o.admin === "postman" || o.admin === apiSecret)
        .value();
    } else if (req.query.min) {
      customers = db
        .get("customers")
        .filter(o => o.orders >= minimum)
        .filter(o => o.admin === "postman" || o.admin === apiSecret)
        .value();
    }
    var empty =
      customers.length < 1
        ? "_The API returned an empty array because there were no valid records for your query._ "
        : "";
    res.status(200).json({
      welcome: welcomeMsg,
      data: {
        customers: customers
      },
      tutorial: {
        title: "You sent a request to filter the customers returned! 🔍",
        intro:
          (req.query.type
            ? "The `type` parameter specified `" + req.query.type + "`. "
            : "") +
          (req.query.min
            ? "The `min` parameter specified `" + req.query.min + "`. "
            : ""),
        steps: [
          {
            note: "The API returned the following data: " + empty,
            raw_data: {
              customers: customers
            }
          },
          {
            note:
              "You could have several query parameters, all of which will be appended to your request address by preceding each with" +
              "`&` e.g. `/customers?type=Organization&min=5`. _This is just like what you see in the browser address bar when you " +
              "visit websites._ You can use different types of parameter with your requests as you will see in some of the requests you build next."
          },
          {
            note:
              "Take another look at the request address—then look at the address in the previous one `Begin learning` and come back here. " +
              "The base URL is the same for both requests, so instead of repeating that as we add more requests, let's store it in a variable " +
              "and reuse the value in all requests."
          },
          {
            note:
              "Select everything before the path `/` in the address bar: `" +
              process.env.PROJECT_DOMAIN +
              ".glitch.me`. Click **Set as variable** &gt; **Set as a new variable**. Enter `training_api` as the " +
              "**Name** with `" +
              process.env.PROJECT_DOMAIN +
              ".glitch.me` as the **Value**. Select **Collection** for the **Scope**, making sure the **" +
              process.env.PROJECT +
              "** collection " +
              "is selected. Click **Set variable**."
          },
          {
            note:
              "You'll see the value when you hover over the variable reference in the addresss. Notice that the variable reference is the name " +
              "surrounded by double curly braces—when the request sends Postman will replace the variable reference with the value. " +
              "Click **Send** to make sure the request still " +
              "behaves the same way and scroll back here."
          },
          {
            note:
              "Now open the previous request `Begin learning` and add the same variable reference there–this time you don't need to create a "+
              "new var because we already have it added to the collection. Replace the base part of address with `{{training_api}}`—it should "+
              "now be `{{training_api}}/begin`. Before you move on, click **Save** in both requests."
          }
        ],
        next: [
          {
            step:
              "So far we've retrieved data from the API, but what if we want to add a new customer? Let's add a request to do that. Click **New**, " +
              "choose **Request**, enter `Add customer` as the name, choosing the **" +
              process.env.PROJECT +
              "** collection, and the **Learn APIs** " +
              "folder. Click **Save to Learn APIs**—the request will open in a new tab so come back here for the address details. _You can also "+
              "add a new request straight into the folder by clicking the **...** next to the folder name and choosing **Add Request**."
          },
          {
            step:
              "In the new request URL, enter `{{training_api}}/customer` and select `POST` from the method drop-down list. **Send** the new " +
              "`POST` request."
          }
        ]
      }
    });
  } else {
    var customers = db
      .get("customers")
      .filter(m => m.admin === "postman" || m.admin === apiSecret)
      .value();
    res.status(200).json({
      welcome: welcomeMsg,
      data: {
        customers: customers
      },
      tutorial: {
        title:
          "You sent a request to retrieve all customers in the database! 🎉",
        intro:
          "The demo API we're using stores a set of customer records. We're going to query and filter customers, add new customers, update, " +
          "and delete customers.",
        steps: [
          {
            note:
              "The request you sent to `/customers` returned the following data. It's an array of the customers currently in the database, " +
              "including a few data values for each.",
            raw_data: {
              customers: customers
            }
          },
          {
            note:
              "Each customer is represented in the JSON as an **Object**, with **Properties** for the id, name, and so on. The API " +
              "returned the customers inside an **Array** which is indicated by the square braces `[]`, and the customer objects are " +
              "separated by commas (so are their properties). In JSON the property names are all text **Strings** which we surround in " +
              "quotes. Notice that the values are all text strings too, except `orders`, which is a number, and therefore not surrounded by quotes."
          },
          {
            note:
              "> &#9432; Open the **Console** along the bottom of the Postman window to see the address the request sent to. You can click " +
              "a request in the Console to see the full detail of what happened when it sent—this is helpful when you're troubleshooting. " +
              "Close and open the Console area whenever you find it useful."
          }
        ],
        next: [
          {
            step:
              "This request retrieved all customers, but you can also filter the customers–typically you would do this " +
              "using **Parameters**. Parameters allow you to supply extra information to make a more specific request. " +
              "Let's say we only want to view customers of a particular type."
          },
          {
            step:
              "Open **Params** and enter a new **Query** parameter, with `type` as the **Key** and `organization` or `individual` as " +
              "the **Value**. You will see the query parameter added to the end of the request address e.g. `/customers?type=individual`. " +
              "Click **Send** again."
          }
        ]
      }
    });
  }
});

app.post("/customer", (req, res) => { 
  const apiSecret = req.get("csm_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "POST /customer",
      what: req.body.name + " " + apiSecret
    })
    .write();
  if (!apiSecret || apiSecret.length < 1 || apiSecret.startsWith("{")) {
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro:
          "This is one of many error responses you'll see if you interact with APIs, so get used to it..! 😆",
        steps: [
          {
            note:
              "Remember that the status code you received for the successful `GET` requests was `200 OK`. This time you got a " +
              "`401 Unauthorized` code. Hover over it for more detail. _If the API has been well designed, the error response should at least help you " +
              "to troubleshoot and figure out next steps, but sadly this is not always the case!_ 😬"
          },
          {
            note:
              "When you send new data to an API, you will typically need to authorize your requests to keep the data source secure. The API "+
              "provider will determine what auth method you need to make a successful request. This API uses API Key auth, which will require "+
              "sending a key value pair (a key name, and a text string value) in the **Header** of the request."
          },
          {
            note:
              "> &#9432; Each API request has a header and a body—so does the response. The header stores metadata—data about the data " +
              "included in the body, for example what format it's in, the length of the content, and so on—information that helps the " +
              "**Client** processing the body data (in this case the client is Postman)."
          },
          {
            note:
              "Dealing with auth can be complex and error-prone, but Postman's auth helpers and variables make the process easier. " +
              "Instead of adding auth details to each request, let's do what we did with the base URL variable and add the config at " +
              "collection level—that way we can authorize all requests in the collection with the same details."
          },
          {
            note:
              "We're going to store the auth " +
              "info in a variable—this helps minimize visibility of what would normally be sensitive credentials. Select the **" +
              process.env.PROJECT +
              "** collection and in **Variables** add a new entry with `email_key` in the **Variable** column, and " +
              "your email address as the value (both fields)."
          },
          {
            note:
              "Open the **Authorization** tab for the collection. Select **API Key** from the drop-down list, enter `csm_key` as the key, and " +
              "`{{email_key}}` as the value to use the variable you created. Hover over the variable name in the auth tab to check that " +
              "your email address is being referenced. Select Add to **Header**. **Save** the collection config and come back here."
          }
        ],
        next: [
          {
            step:
              "You can now opt to use the collection level auth details in any request inside it. In the **Authorization** tab for this " +
              "request, select **Inherit auth from parent** from the drop-down list, and click **Send**."
          }
        ]
      }
    });
  } else if (!validator.validate(apiSecret)) {
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You got an unauthorized error response!",
        intro: "🚫Unauthorized - your key needs to be an email address!",
        steps: [
          {
            note:
              "The API will only authorize your requests if your key is a valid email address."
          }
        ],
        next: [
          {
            step:
              "Open your collection and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address, and that you have **Inherit auth from parent** selected in the request, then click **Send** again."
          }
        ]
      }
    });
  } else {
    if (req.body.name && req.body.address && req.body.type) {
      const postId = db
        .get("customers")
        .push({
          id: shortid.generate(),
          admin: apiSecret,
          adminUid: req.get('user-id'),
          name: req.body.name,
          address: req.body.address,
          type: req.body.type,
          orders: 0
        })
        .write().id;
      res.status(201).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "You added a new customer! 💸",
          intro: "Your new customer was added to the database. 🤑",
          steps: [
            {
              note:
                "Go back into the `Get customers` request, and select **Inherit auth from parent** in the **Authorization** " +
                "tab. The API lets you access the default customers plus any customers you add with your own auth details. " +
                "Uncheck any parameters you had set so that you see the full list of customers and **Send**. You should see a new customer " +
                "with your email address as `admin`."
            },
            {
              note:
                "You've added a new customer, but what if you need to update an existing customer record? Let's do that next. When you update " +
                "an existing record, you will typically use either a `PUT` or a `PATCH` request, to identify the customer you want to " +
                "update, and provide the info you want to update the record with."
            }
          ],
          next: [
            {
              step:
                "**Save** your requests, then create another new one inside the **Learn APIs** folder using the **New** button. " +
                "Give it the name `Update customer` and when it opens select `PUT` method. The address is going to be the same as this " +
                "request (the API can distinguish the operation based on the method you send), so enter `{{training_api}}/customer`, " +
                "and click **Send**."
            }
          ]
        }
      });
    } else
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "🚧 Bad request - please check your body data!",
          intro:
            "You got a different status code again—your request was authorized though, so at least we seem to be making progress.. 😌",
          steps: [
            {
              note:
                "We still need to provide the data representing the new customer to add to the database. We're going to include the data in " +
                "JSON format. In the request **Body** select **raw** and choose `JSON` instead " +
                "of `Text` in the drop-down list. Enter the following including the enclosing curly braces:",
              raw_data: {
                name: "{{$randomFullName}}",
                address: "{{$randomStreetAddress}}",
                type: "individual"
              }
            },
            {
              note:
                "You will notice that there are a couple of variable references in the data. These use dynamic variables—Postman will " +
                "generate a random name and address when you send the request, which is handy when you don't have real data. The API " +
                "will autofill the id, admin, and type properties for the new customer, so we don't need to provide them in the request body."
            }
          ],
          next: [
            {
              step: "With your body data in place, click **Send** again."
            }
          ]
        }
      });
  }
});

//update score
app.put("/customer", function(req, res) {
  const apiSecret = req.get("csm_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "PUT /customer",
      what: req.query.cust_id + " " + apiSecret
    })
    .write();
  if (!apiSecret)
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro:
          "You will need to authorize your request just as you did in the `POST` request.",
        steps: [
          {
            note:
              "Open your collection and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address, and that you have **Inherit auth from parent** selected in the request, then click **Send** again."
          }
        ],
        next: [
          {
            step: "Click **Send**."
          }
        ]
      }
    });
  else if (!validator.validate(apiSecret))
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You got an unauthorized error response!",
        intro: "🚫Unauthorized - your key needs to be an email address!",
        steps: [
          {
            note:
              "The API will only authorize your requests if your key is a valid email address."
          }
        ],
        next: [
          {
            step:
              "Open your collection and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address, and that you have **Inherit auth from parent** selected in the request, then click **Send** again."
          }
        ]
      }
    });
  else if (!req.query.cust_id)
    res.status(400).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Your request is missing some info! 📭",
        intro:
          "In order to update a customer you need to provide the ID for the customer you want to update. Check out the status code " +
          "again–this time it's a `400 Bad Request`. 🙈",
        steps: [
          {
            note:
              "You can only update customers you added to the database. To get a valid ID, pop back into the `Get customers` request and " +
              "copy the `id` value from the customer record you added and come back here (it'll have your email address as `admin`)–it will " +
              "look something like this: `aBcDe12345`."
          },
          {
            note:
              "In **Params** add `cust_id` in the **Key** column, and the `id` value from the customer you added " +
              "as the **Value**."
          }
        ],
        next: [
          {
            step:
              "With your parameter in place (you'll see e.g. `?cust_id=aBcDe12345` added to the request address), click **Send** again."
          }
        ]
      }
    });
  else if (!req.body.address)
    res.status(400).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Your request is incomplete! ✋",
        intro:
          "We've specified the customer we want to update–now we need to provide the data we want to update the customer record with. " +
          "Let's update the address.",
        steps: [
          {
            note:
              "We'll use JSON again to provide the new address. " +
              "In **Body** select **raw** and choose **JSON** instead of `Text` in the drop-down list. Enter the following " +
              "including the enclosing curly braces:",
            raw_data: {
              address: "{{$randomStreetAddress}}"
            }
          },
          {
            note:
              "We're using randomly generated dynamic data again for the address."
          },
          {
            note:
              "> &#9432; When you enter body data Postman will add the appropriate headers to the request automatically. " +
              "Take a look in the **Code** to the right of the request, check the `curl`  code " +
              " to see the `Content-Type` header."
          }
        ],
        next: [
          {
            step: "With your body data in place, click **Send** again."
          }
        ]
      }
    });
  else {
    var updateCust = db
      .get("customers")
      .find({ id: req.query.cust_id })
      .value(); 
    if (updateCust && apiSecret != "postman" && updateCust.admin == apiSecret && updateCust.adminUid == req.get('user-id')) {
      db.get("customers")
        .find({ id: req.query.cust_id })
        .assign({
          address: req.body.address
        })
        .write();

      res.status(201).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "You updated a customer! ✅",
          intro: "Your customer address was updated in the database.",
          steps: [
            {
              note:
                "Go back into the `Get customers` request, deselecting any parameters, and **Send** it again before returning here—" +
                "you should see your updated customer address in the array. **Save** this request before continuing."
            },
            {
              note:
                "We've updated a customer, but let's now try deleting one. This time we'll use a **Path** parameter, which lets us build " +
                "data into the request address."
            }
          ],
          next: [
            {
              step:
                "Create a final request, this time naming it `Remove customer`. When it opens set the method to `DELETE`, and " +
                "the URL to `{{training_api}}/customer/:cust_id` but don't send it yet. This request includes a path parameter with " +
                "`/:cust_id` at the end of the request address—open **Params** and as the value " +
                "for the `cust_id` parameter, enter the `id` of a customer you added like you did for the `PUT` request. " +
                "You can copy the `id` from the response in the `Get customers` request (or the `PUT`) then click **Send**."
            }
          ]
        }
      });
    } else {
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is invalid! ⛔",
          intro:
            "You can only update customers you added using the `POST` method (and that haven't been deleted).",
          steps: [
            {
              note:
                "In **Params** add `cust_id` in the **Key** column, and the `id` value from a customer you added as the " +
                "**Value**."
            }
          ],
          next: [
            {
              step:
                "With the ID parameter for a customer you added in place, click **Send** again."
            }
          ]
        }
      });
    }
  }
});

//delete customer
app.delete("/customer/:cust_id", function(req, res) {
  const apiSecret = req.get("csm_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "DEL /customer",
      what: req.params.cust_id + " " + apiSecret
    })
    .write();
  if (!apiSecret)
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro:
          "You will need to authorize your request just as you did in the `POST` and `PUT` requests.",
        steps: [
          {
            note:
              "Open your collection and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address, and that you have **Inherit auth from parent** selected in the request, then click **Send** again."
          }
        ],
        next: [
          {
            step: "Click **Send**."
          }
        ]
      }
    });
  else if (!validator.validate(apiSecret))
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You got an unauthorized error response!",
        intro: "🚫Unauthorized - your key needs to be an email address!",
        steps: [
          {
            note:
              "The API will only authorize your requests if your key is a valid email address."
          }
        ],
        next: [
          {
            step:
              "Open your collection and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address, and that you have **Inherit auth from parent** selected in the request, then click **Send** again."
          }
        ]
      }
    });
  else {
    //check the record matches the user id
    var cust = db
      .get("customers")
      .find({ id: req.params.cust_id })
      .value(); 
    if (cust && apiSecret != "postman" && cust.admin == apiSecret && cust.adminUid == req.get('user-id')) {
      db.get("customers")
        .remove({ id: req.params.cust_id })
        .write();
      res.status(200).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "You deleted a customer! 🗑️",
          intro: "Your customer was removed from the database. 🧹",
          steps: [
            {
              note:
                "Go back into the `Get customers` request and **Send** it again before returning here, making sure you deselect " +
                "any parameters. You should see that your deleted customer is no longer in the array! **Save** this request before you continue."
            },
            {
              note:
                "You completed the first part of **Postman Galaxy API 101** training! 🏆🎉🚀"
            }
          ],
          next: [
            {
              step:
                "You can submit your completed collection to receive your Galaxy API 101 badge! We'll carry on in the session looking at " +
                "other APIs and topics to continue your API learning—if you haven't managed to complete all of the requests yet you can still " +
                "get support from the team until the end of the session via the event chat (and after it on the Postman forum "+
                "community.postman.com–use the `training` tag)."
            },
            {
              step:
                "When you are ready, carry out the following steps to check your collection for completeness. Make sure all of your requests are "+
                "saved. Select the " +
                process.env.PROJECT +
                " collection and click **Share** &gt; **Get public link** &gt; get or update the public link (_every time you make a change to " +
                "the requests you'll need to regenerate the link_), and copy the URL. Open the request in the final folder in the collection: " +
                "`Check progress` &gt; " +
                "`Collection status` and paste your collection link in as the request address. Click **Send** and open the **Test Results**."
            },
            {
              step:
                "Once your tests are all passing, include your collection link in this form to get your badge and swag! **bit.ly/galaxy-101**"
            },
            {
              step:
                "If one or more of your tests are failing, check back through your requests to make sure you completed all of the steps. " +
                "Ask for support in the session chat or at community.postman.com/tag/training!"
            }
          ]
        }
      });
    } else {
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is invalid! ⛔",
          intro:
            "You can only remove customers you added using the `POST` method (and that haven't been deleted yet).",
          steps: [
            {
              note:
                "Your request address should end `:cust_id`. In **Params** in the `cust_id` row, and the `id` values from a customer " +
                " you added as the **Value**."
            }
          ],
          next: [
            {
              step:
                "With the ID parameter for a customer you added, click **Send** again."
            }
          ]
        }
      });
    }
  }
});

// removes entries from users and populates it with default users
app.get("/reset", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("customers")
      .remove()
      .write();
    console.log("Database cleared");

    defaultCustomers.forEach(cust => {
      db.get("customers")
        .push({
          id: cust.id,
          admin: cust.admin,
          name: cust.name,
          address: cust.address,
          type: cust.type,
          orders: cust.orders
        })
        .write();
    });
    console.log("Default customers added");
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Database reset",
        intro: "You reset the DB."
      }
    });
  }
});

// removes all entries from the collection
app.get("/clear", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("customers")
      .remove()
      .write();
    console.log("Database cleared");
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Database cleared",
        intro: "You cleared the DB."
      }
    });
  }
});

//get all records as admin
app.get("/all", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    var allCustomers = db.get("customers").value();
    res.status(200).json({
      welcome: welcomeMsg,
      data: allCustomers,
      tutorial: {
        title: "All customers",
        intro: "The customers are as follows:",
        steps: [
          {
            raw_data: allCustomers
          }
        ]
      }
    });
  }
});

//get calls
app.get("/calls", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    var allCalls = db.get("calls").value();
    res.status(200).json({
      welcome: welcomeMsg,
      data: allCalls,
      tutorial: {
        title: "All calls",
        intro: "The calls are as follows:",
        steps: [
          {
            raw_data: allCalls
          }
        ]
      }
    });
  }
});

//admin delete record
app.delete("/records", function(req, res) {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes entry from the collection
    db.get("customers")
      .remove({ id: req.query.cust_id })
      .write();
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Customer deleted",
        intro: "You deleted the customer."
      }
    });
  }
});

app.delete("/calls", function(req, res) {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("calls")
      .remove()
      .write();
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Calls deleted",
        intro: "You deleted the calls."
      }
    });
  }
});

//generic get error
app.get("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.post("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.put("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.patch("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.delete("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
