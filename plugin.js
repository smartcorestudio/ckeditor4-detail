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
                template: '<details><summary>Summary</summary><section>Content</section></details>',
                editables: {
                    summary: {
                        selector: 'summary'
                    },
                    content: {
                        selector: 'section',
                        allowedContent: 'br em strong sub sup u s; a[!href,target]'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary; section',
                upcast: function (el) {
                    if (el.name !== 'details') {
                        return false;
                    }

                    var summary = el.getFirst('summary');
                    var content = new CKEDITOR.htmlParser.element('section');

                    el.children.forEach(function (item) {
                        if (item.name !== 'summary') {
                            content.add(item);
                        }
                    });

                    el.children = [];
                    el.add(summary);
                    el.add(content);

                    return true;
                },
                downcast: function (el) {
                    el.attributes = [];
                    var summary = el.getFirst('summary');
                    summary.attributes = [];
                    var content = el.getFirst('section');
                    el.children = [];
                    el.add(summary);
                    content.children.forEach(function (item) {
                        el.add(item);
                    });
                },
                init: function () {
                    var summary = this.element.findOne('summary');

                    summary.setAttribute('contenteditable', true);
                    summary.on('click', function () {
                        summary.focus();
                    });
                }
            });
        }
    });
})(CKEDITOR);
