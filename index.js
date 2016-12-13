/* -----------------------------------------------------------------------------------
   AGOL Featured Items | (c) 2014 Esri | http://www.esri.com/legal/software-license
   'This sample presents the featured items in a resizeable grid'
----------------------------------------------------------------------------------- */

$(document).ready(function () {
    var QUERY = '(group:"c755678be14e4a0984af36a15f5b643e" OR group:"b8787a74b4d74f7fb9b8fac918735153") -type:"Layer" ' +
                '-type: "Map Document" -type:"Map Package" -type:"ArcPad Package" -type:"Project Package" -type:"Explorer Map" ' +
                '-type:"Globe Document" -type:"Scene Document" -type:"Published Map" -type:"Map Template" -type:"Windows Mobile Package" ' +
                '-type:"Layer Package" -type:"Explorer Layer" -type:"Geoprocessing Package" -type:"Application Template" -type:"Code Sample" ' +
                '-type:"Geoprocessing Package" -type:"Geoprocessing Sample" -type:"Locator Package" -type:"Workflow Manager Package" ' +
                '-type:"Windows Mobile Package" -type:"Explorer Add In" -type:"Desktop Add In" -type:"File Geodatabase" ' +
                '-type:"Feature Collection Template" -type:"Code Attachment" -type:"Featured Items" -type:"Symbol Set" -type:"Color Set" ' +
                '-type:"Windows Viewer Add In" -type:"Windows Viewer Configuration"';
    var COUNT = 50;
    var URL = 'https://www.arcgis.com/sharing/rest/search?';
    var eof = false;
    var request = {
        q: QUERY,
        start: 0,
        num: COUNT,
        f: 'json'
    };

    $('#container').scroll($.throttle(250, function () {
        if (eof) { return; }
        if ($('#container').scrollTop() + $('#container').height() > $('#container')[0].scrollHeight - 50) {
            request.start += request.num;
            request.num = 20;
            downloadAgolItems(false);
        }
    }));

    // 
    downloadAgolItems(true);

    function downloadAgolItems(first) {
        var url = URL + $.param(request);
        $.ajax({
            url: url,
            dataType: 'json'
        })
        .done(function (json) {
            for (var i = 0; i < json.results.length; i++) {
                var id = json.results[i].id;
                var ow = json.results[i].owner;
                var ti = json.results[i].title;
                var ty = json.results[i].type;
                var th = json.results[i].thumbnail;
                var de = json.results[i].description;
                var ce = json.results[i].created;
                var kw = json.results[i].typeKeywords;
                var tg = json.results[i].tags;
                var vw = json.results[i].numViews;
                var dc = (de) ? de.replace(/<(?:.|\n)*?>/gm, '') : '';
                var cd = new Date(ce);
                var tu = th ? 'https://www.arcgis.com/sharing/rest/content/items/{0}/info/{1}'.format(id, th) : 'content/images/default.png';
                var hr = 'https://www.arcgis.com/home/item.html?id={0}'.format(id)
                var w = 200 - 50 * Math.random();
                var tex = $(document.createElement('div')).html(ti).addClass('titletext');
                var lab = $(document.createElement('div')).addClass('title');
                var img = $(document.createElement('div')).css({
                    background: 'url({0}) 50% 50% no-repeat'.format(tu),
                    width: '{0}px'.format(w.toString()),
                    height: '133px'
                }).addClass('thumbnail');
                var a = $(document.createElement('a')).attr({
                    href: hr,
                    target: '_blank'
                });
                var div = $(document.createElement('div')).addClass('item');
                tex.appendTo(lab);
                lab.appendTo(img);
                img.appendTo(a)
                a.appendTo(div);
                div.appendTo('#container');
            }

            if (first) {
                $('#container').rowGrid({
                    itemSelector: '.item', minMargin: 10, maxMargin: 10, firstItemClass: 'first-item', lastRowClass: 'last-row'
                });
            }
            else {
                $('#container').rowGrid('appended');
            }

            eof = json.nextStart == -1;
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //Debug.Error("priv.handleAjaxError", arguments);
        });
    }

    String.prototype.format = function () {
        var s = this;
        var i = arguments.length;
        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };
});