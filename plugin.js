'use strict';

(function (CKEDITOR) {
    CKEDITOR.plugins.add('detail', {
        requires: 'widget',
        icons: 'detail',
        hidpi: true,
        lang: 'de,en',
        onLoad: function () {
            CKEDITOR.addCss(
                '.details:not(.details-open) > :not(.details-summary) {display: none;}' +
                '.details-summary:first-child::before {display: inline-block; content: "▼"; margin-right: 0.5rem;}' +
                '.details:not(.details-open) > .details-summary:first-child::before {content: "▶";}'
            );
        },
        init: function (editor) {
            var formatTags = editor.config.format_tags.split(';');
            var h = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].filter(function (item) {
                return formatTags.indexOf(item) >= 0;
            });

            editor.widgets.add('detail', {
                button: editor.lang.detail.title,
                template: '<div class="details"><p class="details-summary">Summary</p><div class="details-content"></div></div>',
                editables: {
                    summary: {
                        selector: '.details-summary',
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

                    var editSummary = new CKEDITOR.htmlParser.element('p', {'class': 'details-summary'});
                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'details-content'});
                    var summary = el.getFirst('summary');
                    var html = 'Summary';

                    el.name = 'div';
                    el.addClass('details');
                    el.add(editSummary, 0);
                    el.add(content, 1);

                    if (summary) {
                        if (summary.children.length > 0 && summary.children[0].type === CKEDITOR.NODE_ELEMENT) {
                            if (h.indexOf(summary.children[0].name) >= 0) {
                                editSummary.attributes['data-details-head'] = summary.children[0].name;
                            }

                            html = summary.children[0].getHtml();
                        } else if (summary.children.length > 0 && summary.children[0].type === CKEDITOR.NODE_TEXT) {
                            html = summary.children[0].value;
                        }

                        summary.remove();
                    }

                    editSummary.setHtml(html);

                    if (el.children.length > 2) {
                        content.children = el.children.slice(2);
                        el.children = el.children.slice(0, 2);
                    }

                    return true;
                },
                downcast: function (el) {
                    var editSummary = el.children[0];
                    var content = el.children[1];
                    var summary = new CKEDITOR.htmlParser.element('summary');
                    var headEl = editSummary.attributes['data-details-head'] || null;

                    el.add(summary, 0);

                    if (!!editSummary.attributes['data-details-head']) {
                        var head = new CKEDITOR.htmlParser.element(headEl);
                        head.setHtml(editSummary.getHtml());
                        summary.add(head);
                    } else {
                        summary.setHtml(editSummary.getHtml());
                    }

                    editSummary.remove();
                    content.replaceWithChildren();
                    el.name = 'details';
                    el.attributes = [];
                },
                init: function () {
                    this.element.getChild(0).on('click', function () {
                        if (this.getParent().hasClass('details-open')) {
                            this.getParent().removeClass('details-open');
                        } else {
                            this.getParent().addClass('details-open');
                        }
                    });
                }
            });
        }
    });
})(CKEDITOR);
