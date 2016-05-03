var should = require("chai").should();
var router = require("../../routes/index.js");
var express = require("express");
var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var Idea = require("../../models/Ideas")
var request = require("supertest");

var app = express();
app.use("/", router);

