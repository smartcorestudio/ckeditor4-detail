'use strict';

(function (CKEDITOR) {
    var h = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    CKEDITOR.dtd['$editable']['summary'] = 1;
    CKEDITOR.plugins.add('detail', {
        requires: 'widget',
        icons: 'detail',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('detail', {
                button: editor.lang.detail.title,
                template: '<details><summary>Summary</summary><div class="details-content"></div></details>',
                editables: {
                    summary: {
                        selector: 'summary',
                        allowedContent: {}
                    },
                    content: {
                        selector: '.details-content'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary',
                upcast: function (el) {
                    if (el.name !== 'details') {
                        return false;
                    }

                    var summary = el.getFirst('summary');
                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'details-content'});

                    if (!!summary) {
                        if (summary.children.length > 0 && summary.children[0].type === CKEDITOR.NODE_ELEMENT) {
                            if (h.indexOf(summary.children[0].name) >= 0) {
                                summary.attributes['data-details-head'] = summary.children[0].name;
                            }

                            summary.setHtml(summary.children[0].getHtml());
                        } else if (summary.children.length > 0 && summary.children[0].type === CKEDITOR.NODE_TEXT) {
                            summary.setHtml(summary.children[0].value);
                        } else {
                            summary.setHtml('Summary');
                        }
                    } else {
                        summary = new CKEDITOR.htmlParser.element('summary');
                        summary.setHtml('Summary');
                        el.add(summary, 0);
                    }

                    el.add(content, 1);

                    if (el.children.length > 2) {
                        content.children = el.children.slice(2);
                        el.children = el.children.slice(0, 2);
                    }

                    return true;
                },
                downcast: function (el) {
                    var summary = el.children[0];
                    var content = el.children[1];
                    var headEl = summary.attributes['data-details-head'] || null;

                    if (headEl) {
                        var head = new CKEDITOR.htmlParser.element(headEl);
                        head.setHtml(summary.getHtml());
                        summary.add(head, 0);
                        summary.children = el.children.slice(0, 1);
                    }

                    content.replaceWithChildren();
                    el.attributes = [];
                },
                init: function () {
                    var summary = this.element.getChild(0);

                    summary.on('keyup', function (ev) {
                        if (ev.data['$'].keyCode === 32) {
                            ev.data['$'].preventDefault();
                            editor.insertText(' ');
                        }
                    });
                }
            });
        }
    });
})(CKEDITOR);
