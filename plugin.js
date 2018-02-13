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
                template: '<details><summary>Summary</summary><p>Content</p></details>',
                editables: {
                    summary: {
                        selector: 'p[data-details]'
                    },
                    content: {
                        selector: 'div[data-details]',
                        allowedContent: 'br p em s strong sub sup u; a[!href,target]'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary; div[data-details]',
                upcast: function (el) {
                    return el.name === 'details' && el.children && el.children[0].name === 'summary';
                },
                downcast: function (el) {
                    var div = el.children[2];
                    el.attributes = [];
                    el.children = el.children.slice(0, 1).concat(div.children);
                },
                init: function () {
                    var el = this.element;
                    var summary, p, div;

                    if (el.getChildren().length !== 3
                        || el.getChild(1).getName() !== 'p'
                        || !el.getChild(1).getAttribute('data-details')
                        || el.getChild(2).getName() !== 'div'
                        || !el.getChild(2).getAttribute('data-details')
                    ) {

                        div = new CKEDITOR.dom.element('div');
                        div.setAttribute('data-details', true);
                        el.moveChildren(div);
                        div.getChild(0).move(el);
                        p = new CKEDITOR.dom.element('p');
                        p.setAttribute('data-details', true);
                        p.appendTo(el);
                        div.appendTo(el);
                    }

                    summary = el.getChild(0);
                    p = el.getChild(1);
                    p.setAttribute('contenteditable', true);
                    p.setHtml(summary.getHtml());
                    p.on('blur', function () {
                        summary.setHtml(p.getHtml());
                    });
                    div.getChild(2);
                    div.setAttribute('contenteditable', true);
                }
            });
        }
    });
})(CKEDITOR);
