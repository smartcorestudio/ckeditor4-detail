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
                template: '<details><summary>Summary</summary><p class="details-summary"></p><div class="details-content"><p>Content</p></div></details>',
                editables: {
                    summary: {
                        selector: 'p.details-summary'
                    },
                    content: {
                        selector: 'div.details-content'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary; p(details-summary); div(details-content)',
                upcast: function (el) {
                    if (el.name !== 'details') {
                        return false;
                    }

                    if (el.children.length <= 0 || el.children[0].name !== 'summary') {
                        var summary = new CKEDITOR.htmlParser.element('summary');

                        summary.add(new CKEDITOR.htmlParser.text('Summary'));
                        el.add(summary, 0);
                    }

                    if (el.children.length < 2 || el.children[1].name !== 'p' || !el.children[1].hasClass('details-summary')) {
                        el.add(new CKEDITOR.htmlParser.element('p', {'class': 'details-summary'}), 1);
                    }

                    if (el.children.length !== 3 || el.children[2].name !== 'div' || !el.children[2].hasClass('details-content')) {
                        var div = new CKEDITOR.htmlParser.element('div', {'class': 'details-content'});

                        if (el.children.length > 2) {
                            div.children = el.children.slice(2);
                        } else {
                            var p = new CKEDITOR.htmlParser.element('p');
                            p.add(new CKEDITOR.htmlParser.text('Content'));
                            div.add(p);
                        }

                        el.add(div, 2);
                        el.children = el.children.slice(0, 3);
                    }

                    return true;
                },
                downcast: function (el) {
                    el.attributes = [];
                    el.children = el.children.slice(0, 1);
                    el.setHtml(el.getHtml() + this.editables.content.getData());
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
