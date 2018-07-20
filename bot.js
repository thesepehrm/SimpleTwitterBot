var twit = require("twit");
var config = require("./config.js");
var Twitter = new twit(config);
let SELFUSER = "sourcherries__";

var stream = Twitter.stream("statuses/filter", { track: ["اندر احوالات"] });
var followstream = Twitter.stream("user");

stream.on("tweet", function(tweet) {
  if ("user" in tweet) if (tweet["user"]["screen_name"] == SELFUSER) return;
  if ("retweeted_status" in tweet) {
    return;
  }
  var text = tweet["text"];
  text = proccesString(text);

  Twitter.post("statuses/update", { status: text }, function(
    err,
    data,
    response
  ) {
    if (err) console.log(err);
  });
});

followstream.on("user_event", function(json) {
  if (json.event === "follow" && json.source.screen_name != SELFUSER) {
    followUser(json.source.screen_name);
    //console.log(json.source.screen_name + " Followed me!");
  }
});

function proccesString(str) {
  str = str.replace(
    /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g,
    ""
  );

  return str;
}

function followUser(name) {
  Twitter.post("friendships/create", { screen_name: name }, function(
    err,
    data,
    response
  ) {
    if (err) console.log(err);
  });
}
