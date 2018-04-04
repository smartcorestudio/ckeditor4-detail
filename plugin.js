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
                        selector: 'div[data-details]'
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
                        if (el.children.length < 2 || el.children[1].name !== 'p' || !el.children[1].attributes.hasOwnProperty('data-details')) {
                            el.add(new CKEDITOR.htmlParser.element('p', {'data-details': ''}), 1);
                        }

                        if (el.children.length < 3 || el.children[2].name !== 'div' || !el.children[2].attributes.hasOwnProperty('data-details')) {
                            var div = new CKEDITOR.htmlParser.element('div', {'data-details': ''});
                            div.children = el.children.slice(2);
                            el.add(div, 2);
                        }

                        el.children = el.children.slice(0, 3);
                    }

                    return true;
                },
                downcast: function (el) {
                    el.attributes = [];
                    el.children = el.children.slice(0, 1);
                    el.setHtml(el.getHtml() + this.editables['div'].getData());
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
