'use strict';

(function (CKEDITOR) {
    CKEDITOR.plugins.add('detail', {
        requires: 'widget',
        icons: 'detail',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('detail', {
                button: editor.lang.detail.title,
                template: '<details><summary>Summary</summary><p data-details></p><div data-details><p>Content</p></div></details>',
                editables: {
                    p: {
                        selector: 'p[data-details]'
                    },
                    div: {
                        selector: 'div[data-details]',
                        allowedContent: 'br p em s strong sub sup u; a[!href,target]'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary; p[data-details]; div[data-details]',
                upcast: function (el) {
                    if (el.name !== 'details' || el.children.length <= 0 || el.children[0].name !== 'summary') {
                        return false;
                    }

                    if (el.children.length !== 3
                        || el.children[1].name !== 'p' || !el.children[1].attributes.hasOwnProperty('data-details')
                        || el.children[2].name !== 'div' || !el.children[2].attributes.hasOwnProperty('data-details')
                    ) {
                        var p, div;

                        if (el.children.length >= 2 && el.children[1].name === 'p' && el.children[1].attributes.hasOwnProperty('data-details')) {
                            p = el.children[1];
                        } else {
                            p = new CKEDITOR.htmlParser.element('p', {'data-details': ''});
                            el.add(p, 1);
                        }

                        if (el.children.length >= 3 && el.children[2].name === 'div' && el.children[2].attributes.hasOwnProperty('data-details')) {
                            div = el.children[2];
                        } else {
                            div = new CKEDITOR.htmlParser.element('div', {'data-details': ''});
                            div.children = el.children.slice(2);
                            el.add(div, 2);
                        }

                        el.children = el.children.slice(0, 3);
                    }

                    return true;
                },
                downcast: function (el) {
                    var div = el.children[2];
                    el.attributes = [];
                    el.children = el.children.slice(0, 1).concat(div.children);
                },
                init: function () {
                    var summary = this.element.getChild(0);
                    var p = this.element.getChild(1);

                    p.setHtml(summary.getHtml());
                    p.on('blur', function () {
                        summary.setHtml(p.getHtml());
                    });
                }
            });
        }
    });
})(CKEDITOR);
