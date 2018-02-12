'use strict';

(function (CKEDITOR) {
    var tpl = '<summary>###Summary###</summary><p data-details="summary">###Summary###</p><div data-details="content">###Content###</div>';
    var critSummary = function (c) {
        return c.name === 'p' && c.attributes['data-details'] === 'summary';
    };
    var critContent = function (c) {
        return c.name === 'div' && c.attributes['data-details'] === 'content';
    };

    CKEDITOR.plugins.add('detail', {
        requires: 'widget',
        icons: 'detail',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('detail', {
                button: editor.lang.detail.title,
                template: '<details>' + tpl + '</details>',
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
                    el.setHtml(tpl.replace(/###Summary###/g, s).replace('###Content###', el.getHtml()));

                    return true;
                },
                downcast: function (el) {
                    el.attributes = [];
                    el.setHtml('<summary>' + el.getFirst(critSummary).getHtml() + '</summary>' + el.getFirst(critContent).getHtml());
                },
                init: function () {
                    var s1 = this.element.findOne('summary');
                    var s2 = this.element.findOne('p[data-details=summary]');

                    if (!!s1 && !!s2) {
                        s2.on('blur', function () {
                            s1.setHtml(s2.getHtml());
                        });
                    }
                }
            });
        }
    });
})(CKEDITOR);
