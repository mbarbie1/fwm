fwm
===

Website based on node.js.
The goal is to view, store, exchange, and analyse 3D fluorescent microscopy image stacks from the PREDECT IMI project.
(Most of the functionality should be moved eventually to the WebMicroscope system.)  

## Functionality

The workflow could be the following:

1. Upload the image-stacks to the fwm-website
1. fwm-website redirects user to MBASE website to fill in the metadata of the images
1. 

Implemented functionality

- Login
- Basic upload, download, browsing of data-files

To do

- Using the user-sessions to identify the user and personalizing the options.
- Database-based file-browser with
	- User (owner) permissions
	- User-specific upload-folders
- 3D image stack viewer
	- Written in client-side javascript
	- Basic server-side IIIF image server API implementation in node
- Connection to MBASE

https://github.com/lovell/sharp
https://github.com/jcupitt/libvips
http://www.vips.ecs.soton.ac.uk/supported/current/win32/