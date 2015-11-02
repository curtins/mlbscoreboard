<?php

$settings = array(
	"api_key" => "",
	"api_secret" => "",
	"access_token" => "",
	"access_token_secret" => ""
);

$name = $_GET["name"];
$count = $_GET["count"];

require_once("TwitterAPIExchange.php");

$url = "https://api.twitter.com/1.1/statuses/user_timeline.json";
$requestMethod = "GET";
$getfield = "?screen_name=" . $name . "&count=" . $count . "&trim_user=true";

$translated = array(
	"consumer_key" => $settings["api_key"],
	"consumer_secret" => $settings["api_secret"],
	"oauth_access_token" => $settings["access_token"],
	"oauth_access_token_secret" => $settings["access_token_secret"]
);

$twitter = new TwitterAPIExchange($translated);

echo $twitter->setGetfield($getfield)
			 ->buildOauth($url, $requestMethod)
			 ->performRequest();

?>