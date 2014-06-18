var expect = chai.expect;
var dialog;

describe('Creating a simple Messi window', function() {

    it('should be ready', function() {
        expect(Messi).to.be.a('function');
    });

    it('should open and close', function(done) {
        //expect(jQuery('.messi:visible').get(0)).to.be.undefined;
        dialog = new Messi('my message');
        expect(jQuery('.messi:visible', dialog.messi).get(0)).to.be.defined;
        dialog.unload();
        setTimeout(function() {
            expect(jQuery('.messi:visible', dialog.messi).get(0)).to.be.undefined;
            done();
        }, 100);
    });

    it('should show "my message"', function() {
        dialog = new Messi('my message');
        expect(jQuery('.messi-content').text()).to.be.equal('my message');
        dialog.unload();
    });

    it('should toggle the dialog', function(done) {
        dialog = new Messi('my message');
        expect(jQuery('.messi:visible', dialog).get(0)).to.be.defined;
        dialog.toggle();
        setTimeout(function() {
            expect(jQuery('.messi:visible', dialog).get(0)).to.be.undefined;
            dialog.toggle();
            setTimeout(function() {
                expect(jQuery('.messi:visible', dialog).get(0)).to.be.defined;
                dialog.unload();
                done();
            }, 100);
        }, 100);
    });

    it('should remain open on show()', function() {
        dialog = new Messi('my message');
        expect(jQuery('.messi:visible', dialog).get(0)).to.be.defined;
        expect(dialog.visible).to.be.ok;
        dialog.show();
        expect(jQuery('.messi:visible', dialog).get(0)).to.be.defined;
        expect(dialog.visible).to.be.ok;
        dialog.unload();
    });

    it('should remain hidden on hide()', function() {
        dialog = new Messi('my message');
        dialog.hide();
        expect(jQuery('.messi:visible', dialog).get(0)).to.be.undefined;
        dialog.hide();
        expect(jQuery('.messi:visible', dialog).get(0)).to.be.defined;
        dialog.unload();
    });

    it('should have a close button', function() {
        dialog = new Messi('my message');
        expect(jQuery('.messi-closebtn', dialog.messi).get(0)).to.be.defined;
        dialog.unload();
    });

    it('should close when we click the button', function(done) {
        dialog = new Messi('my message');
        jQuery('.messi-closebtn', dialog.messi).click();
        setTimeout(function() {
            expect(jQuery('.messi:visible', dialog).get(0)).to.be.undefined;
            done();
        }, 100);
    });

    it('should close automatically when autoclose is enabled', function(done) {
        dialog = new Messi('my message', {autoclose: 100});
        expect(jQuery('.messi:visible', dialog).get(0)).to.be.defined;
        setTimeout(function() {
            expect(jQuery('.messi:visible', dialog).get(0)).to.be.defined;
        }, 90);
        setTimeout(function() {
            expect(jQuery('.messi:visible', dialog).get(0)).to.be.undefined;
            done();
        }, 200);
    });

    it('should show a closebutton when option is enabled', function() {
        dialog = new Messi('my message', {closeButton: true});
        expect(jQuery('.messi-closebtn', dialog.messi).get(0)).to.be.defined;
        dialog.unload();
    });

    it('should not show a closebutton when option is disabled', function() {
        dialog = new Messi('my message', {closeButton: false});
        expect(jQuery(dialog.messi).get(0)).to.be.defined;
        expect(jQuery('.messi-closebtn', dialog.messi).get(0)).to.be.undefined;
        dialog.unload();
    });

});

describe('Create a Messi window with advanced features', function() {

    it('and a callback', function(done) {
        dialog = new Messi(
            'This is a message with Messi with custom buttons.',
            {
                title: 'Buttons',
                buttons: [{id: 0, label: 'Close', val: 'X', 'class': 'cbClose'}],
                callback: function(value) {
                    jQuery(document).triggerHandler('messi.cb');
                    return true;
                }
            }
        );
        jQuery(document).bind('messi.cb', function(val) {
            setTimeout(function() {
                expect(jQuery(dialog.messi).is(':visible')).to.be.false;
                jQuery(document).unbind('messi.cb');
                done();
            }, 800);
        });
        expect(jQuery('.messi-title:visible', dialog.messi).text()).to.equal('Buttons');
        expect(jQuery('button.cbClose', dialog.messi).get(0)).to.be.defined;
        jQuery('.cbClose', dialog.messi).click();
    });

    it('and a failing callback', function(done) {
        dialog = new Messi(
            'This is a message with Messi with custom buttons.',
            {
                title: 'Buttons',
                buttons: [{id: 0, label: 'Close', val: 'X', 'class': 'cbClose'}],
                callback: function(value) {
                    jQuery(document).triggerHandler('messi.cb');
                    return false;
                }
            }
        );
        jQuery(document).bind('messi.cb', function(val) {
            setTimeout(function() {
                expect(jQuery(dialog.messi).is(':visible')).to.be.true;
                dialog.unload();
                done();
            }, 350);
        });
        expect(jQuery('.messi-title:visible', dialog.messi).text()).to.equal('Buttons');
        expect(jQuery('button.cbClose', dialog.messi).get(0)).to.be.defined;
        jQuery('.cbClose', dialog.messi).click();
    });
});

describe('Create a titled Messi window', function() {
    beforeEach(function() {
        dialog = new Messi('my message', {title: 'My title'});
    });

    afterEach(function() {
        dialog.unload();
    });

    it('should have a title', function() {
        expect(jQuery('.messi-title:visible', dialog.messi).text()).to.equal('My title');
    });

    it('should have a visible close button', function() {
        expect(jQuery('.messi-closebtn', dialog.messi).get(0)).to.defined;
        expect(jQuery('.messi-closebtn', dialog.messi).css('opacity')).to.equal('1');
    });

    it('should close when we click the button', function(done) {
        dialog = new Messi('my message');
        jQuery('.messi-closebtn', dialog.messi).click();
        setTimeout(function() {
            expect(jQuery('.messi:visible', dialog.messi).get(0)).to.be.undefined;
            done();
        }, 100);
    });
});

describe('Create a modal Messi window', function() {
    dialog = null;

    beforeEach(function() {
        dialog = new Messi(
            'This is a message with Messi in modal view. Now you can\'t interact with other elements in the page until close this.',
            {title: 'Modal Window', modal: true}
        );
    });

    afterEach(function() {
        dialog.unload();
    });

    it('should have a title', function() {
        expect(jQuery('.messi-title:visible', dialog.messi).text()).to.equal('Modal Window');
    });

    it('should open a modal background', function() {
        expect(jQuery('.messi-modal', dialog.messi).get(0)).to.defined;
    });
});

describe('Create an absolutely positioned Messi window', function() {
    it('should be positioned absolutely', function() {
        dialog = new Messi(
            'This is a message with Messi in absolute position.',
            {
                center:   false,
                width:    '200px',
                viewport: {top: '52px', left: '138px'}
            }
        );

        jQuery(window).trigger('resize');
        var position = dialog.messi.position();
        expect(position).to.eql({top: 52, left: 138});
        dialog.unload();
    });
});

describe('Create a Messi window with a custom buttons', function() {
    dialog = null;

    beforeEach(function() {
        dialog = new Messi(
            'This is a message with Messi with custom buttons.',
            {title: 'Buttons', buttons: [{id: 0, label: 'Close', val: 'X'}]}
        );
    });

    afterEach(function() {
        dialog.unload();
    });

    it('should show my message', function() {
        expect(jQuery('.messi-content', dialog.messi).text()).to.be.equal('This is a message with Messi with custom buttons.');
    });

    it('should not have an inline close button', function() {
        expect(jQuery('.messi-closebtn', dialog.messi).get(0)).to.be.undefined;
    });

    it('should have a custom "Close" action button', function() {
        expect(jQuery('.messi-actions button', dialog.messi).text()).to.equal('Close');
    });
});

describe('Message with custom buttons (yes/no/cancel)', function() {
    dialog = null;

    beforeEach(function() {
        dialog = new Messi(
            'This is a message with Messi with custom buttons.',
            {
                title: 'Buttons',
                buttons: [
                    {id: 0, label: 'Yes', val: 'Y'},
                    {id: 1, label: 'No', val: 'N'},
                    {id: 2, label: 'Cancel', val: 'C'}
                ]
            }
        );
    });

    afterEach(function() {
        dialog.unload();
    });

    it('should have a yes button', function() {
        expect(jQuery('button[value="Yes"]', dialog.messi).get(0)).to.be.defined;
    });

    it('should have a no button', function() {
        expect(jQuery('button[value="No"]', dialog.messi).get(0)).to.be.defined;
    });

    it('should have a cancel button', function() {
        expect(jQuery('button[value="Cancel"]', dialog.messi).get(0)).to.be.defined;
    });
});

describe('Message with custom buttons (yes/no) and style classes', function() {
    dialog = null;

    beforeEach(function() {
        dialog = new Messi(
            'This is a message with Messi with custom buttons.',
            {
                title: 'Buttons',
                buttons: [
                    {id: 0, label: 'Yes', val: 'Y', 'class': 'btn-success'},
                    {id: 1, label: 'No', val: 'N', 'class': 'btn-danger'}
                ]
            }
        );
    });

    afterEach(function() {
        dialog.unload();
    });

    it('should have a yes button with class', function() {
        expect(jQuery('button.btn-success[value="Yes"]', dialog.messi).get(0)).to.be.defined;
    });

    it('should have a no button with class', function() {
        expect(jQuery('button.btn-danger[value="No"]', dialog.messi).get(0)).to.be.defined;
    });
});

describe('Window with success title', function() {
    dialog = null;

    beforeEach(function() {
        dialog = new Messi(
            'This is a message with Messi.',
            {
                title: 'Title',
                titleClass: 'success',
                buttons: [{id: 0, label: 'Close', val: 'X'}]
            }
        );
    });

    afterEach(function() {
        dialog.unload();
    });

    it('should have a titleClass of "success"', function() {
        expect(jQuery('.messi-titlebox.success', dialog.messi).attr('class')).to.match(/success/);
    });
});

describe('Window with error title (animated)', function() {
    dialog = null;

    beforeEach(function() {
        dialog = new Messi(
            'This is a message with Messi.',
            {
                title: 'Title',
                titleClass: 'anim error',
                buttons: [{id: 0, label: 'Close', val: 'X'}]
            }
        );
    });

    afterEach(function() {
        dialog.unload();
    });

    it('titleClass should be "error"', function() {
        expect(jQuery('.messi-titlebox.error', dialog.messi).text()).to.be.equal('Title');
    });

    it('titleClass should be animated', function() {
        expect(jQuery('.messi-titlebox.anim', dialog.messi).text()).to.be.equal('Title');
    });
});

describe('Window with a margin', function() {
    it('when center is on', function() {
        dialog = new Messi('This is a message with Messi.', {
            title: 'Margin Center Test',
            center: true,
            margin: 15,
            viewport: { top: '10px', left: '10px' }
        });

        expect(dialog.messi.position().top).to.not.equal(10);
        dialog.unload();
    });

    it('when margin is off', function() {
        dialog = new Messi('This is a message with Messi.', {
            title: 'Margin Off Test',
            center: false,
            margin: 0,
            viewport: { top: '10px', left: '10px' }
        });

        expect(dialog.messi.position()).to.eql({top: 10, left: 10});
        dialog.unload();
    });

    it('when margin is on', function() {
        dialog = new Messi('This is a message with Messi.', {
            title: 'Margin On Test',
            center: false,
            margin: 15,
            viewport: { top: -15, left: -15 }
        });

        expect(dialog.messi.position()).to.eql({top: 15, left: 15});
        dialog.unload();
    });

    it('when margin is on and too low', function() {
        dialog = new Messi('This is a message with Messi.', {
            title: 'Margin On Test',
            center: false,
            margin: 15,
            viewport: { top: 2900, left: 15 }
        });

        var newTop = window.innerHeight - 15 - dialog.messi.height();

        expect(dialog.messi.position()).to.eql({top: newTop, left: 15});
        dialog.unload();
    });

    it('when margin is on and too far right', function() {
        dialog = new Messi('This is a message with Messi.', {
            title: 'Margin On Test',
            center: false,
            margin: 15,
            viewport: { top: 15, left: 2900 },
            width: '300px'
        });

        var newLeft = window.innerWidth - 15 - dialog.messi.width();

        expect(dialog.messi.position()).to.eql({top: 15, left: newLeft});
        dialog.unload();
    });
});