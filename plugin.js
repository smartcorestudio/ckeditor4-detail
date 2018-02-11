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
                template: '<details><p data-details="summary">Summary</p><div data-details="content">Content</div></details>',
                editables: {
                    summary: {
                        selector: 'p[data-details=summary]'
                    },
                    content: {
                        selector: 'div[data-details=content]',
                        allowedContent: 'br em strong sub sup u s; a[!href,target]'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; p[data-details=summary]; div[data-details=content]',
                upcast: function (el) {
                    if (el.name !== 'details') {
                        return false;
                    }

                    var s = el.getFirst('summary').getHtml();
                    el.find('summary').forEach(function (item) {
                        item.remove();
                    });
                    el.setHtml('<summary>' + s + '</summary><p data-details="summary">' + s + '</p><div data-details="content">' + el.getHtml() + '</div>');

                    return true;
                },
                downcast: function (el) {
                    var crit = function (c) {
                        return c.name === 'p' && c.attributes['data-details'] === 'summary';
                    };
                    var html = '<summary>' + el.getFirst(crit).getHtml() + '</summary>';
                    crit = function (c) {
                        return c.name === 'div' && c.attributes['data-details'] === 'content';
                    };
                    html += el.getFirst(crit).getHtml();
                    el.setHtml(html);
                },
                init: function () {
                    var widget = this;
                    var el = this.element;
                },
                data: function () {
                    var el = this.element;
                }
            });
        }
    });
})(CKEDITOR);
