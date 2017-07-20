#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const fse = require('fs-extra');
const gm = require('gm');
imageMagick = gm.subClass({ imageMagick: true });// install imageMagick.exe first, more info from http://www.imagemagick.org/script/binary-releases.php

let data = {};

const handlerJson = (file) => {
    console.log("filepath is %s", file);
    let originData = require(path.join(process.cwd(),file));
    data = {
    	id:originData.id,
    	issue:originData.issue,
    	articles: (function () {
    		let _tmp = [];
    		originData.sections.forEach( (el, i)=>{
    			el.articles.forEach( (element, index) => {
    				delete element.url
    				delete element['big-html'];
    				delete element['nav-hor'];
    				delete element['pdf-hor'];
    				let _ipadId = element['comment-url'].replace('http://magazine.pchouse.com.cn/','').replace('http://magazine.pcauto.com.cn/','').split('/');
    				element['ipad-article-id'] = _ipadId[1];
    				delete element['comment-url'];
    				_tmp.push(element)
    			});
    		});
    		return _tmp;
    	})()
    }

    fs.writeFile(path.join(process.cwd(),'magazine.json'), JSON.stringify(data), 'utf8', (err) => {
	  if (err) throw err;
	  console.log(chalk.green('It\'s done! ٩(ˊωˋ*)و'));
	});

    fse.walk(process.cwd())
    .on('data', function(item) {
        if(-1<path.basename(item.path).indexOf('thumb-ver.jpg')){
            imageMagick(item.path).resize(500,500,"!").write(item.path, function(err){
                if (err) return console.error(err)
                 console.log(chalk.green(item.path + ' has been resize. ٩(ˊωˋ*)و'));
            });
        }

    })

}


program
    .version('0.0.2')
    .arguments('<file>')
    .action(function(file) {
        handlerJson(file)
    });

program.parse(process.argv);
