'use strict';

(function (CKEDITOR) {
    var h = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    CKEDITOR.plugins.add('detail', {
        requires: 'widget',
        icons: 'detail',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('detail', {
                button: editor.lang.detail.title,
                template: '<details><summary>Summary</summary><p class="head"></p><div class="content"><p>Content</p></div></details>',
                editables: {
                    head: {
                        selector: '.head'
                    },
                    content: {
                        selector: '.content'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary; ' + h.join(' ') + ' p(head); div(content)',
                upcast: function (el) {
                    if (el.name !== 'details') {
                        return false;
                    }

                    var summary;
                    var head = 'p';
                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});

                    if (el.children.length > 0 && el.children[0].name === 'summary') {
                        summary = el.children[0];
                    } else {
                        summary = new CKEDITOR.htmlParser.element('summary');
                        el.add(summary, 0);
                    }

                    if (summary.children.length <= 0) {
                        summary.add(new CKEDITOR.htmlParser.text('Summary'));
                    } else if (summary.children[0].type === CKEDITOR.NODE_ELEMENT && h.indexOf(summary.children[0].name) >= 0) {
                        head = summary.children[0].name;
                    }

                    el.add(new CKEDITOR.htmlParser.element(head, {'class': 'head'}), 1);

                    if (el.children.length > 2) {
                        content.children = el.children.slice(2);
                    } else {
                        var p = new CKEDITOR.htmlParser.element('p');
                        p.add(new CKEDITOR.htmlParser.text('Content'));
                        content.add(p);
                    }

                    el.add(content, 2);
                    el.children = el.children.slice(0, 3);

                    return true;
                },
                downcast: function (el) {
                    el.attributes = [];
                    el.children = el.children.slice(0, 1);
                    el.setHtml(el.getHtml() + this.editables.content.getData());
                },
                init: function () {
                    var summary = this.element.getChild(0);
                    var head = this.element.getChild(1);
                    var ref = h.indexOf(head.getName()) >= 0 ? summary.getChild(0) : summary;

                    head.setHtml(ref.getHtml());
                    head.on('blur', function () {
                        ref.setHtml(head.getHtml());
                    });
                }
            });
        }
    });
})(CKEDITOR);
