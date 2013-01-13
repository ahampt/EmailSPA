EmailSPA
========

Single page javascript application for email generation. Made specifically for the membership coordinator of the TAMU Flying Aggies. Can easily be adapted for other purposes. Created in conjunction with and designed to work with [simpleRESTDB](http://github.com/ahampt/simpleRESTDB).

## Installation

Install EmailSPA yourself to contribute to the site and use it for your own needs. There's plenty to add and fix.

### Dependencies

If not already present:

1. Install a [Modern Browser](http://browsehappy.com/).

2. Install [Adobe Flash Player](http://get.adobe.com/flashplayer/) 11+.

### Configuration

1. Download the project code from master or fork if you plan on possibly contributing later.

2. Update javascript to correctly send requests.
    * Fill in the URL to send requests to in the ajaxGet and ajaxUpdate functions in std.js

3. Update html to add optional google tracking features and use CDN for static files delivery.
    * Fill in the string found after "setAccount" to proper google tracking code
    * Place static files in CDN distribution and replace "static/" links with CDN URL's
