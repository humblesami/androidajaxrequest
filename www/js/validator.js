
//call this function in submit event like following
//if(!isFormValid())
//return;

function isFormValid() {
    var fields = $('.pat');
    $('select').each(function () {
        var index = this.slectedIndex;        
        if (index == -1) {
            if (!ob.is('.error'))
                ob.addClass('error');
        }
        else {
            ob.removeClass('error');
        }
    });
    $('.pat').each(function () {
        validateSingleField($(this));
    });
    if ($('.error').length > 0)
        return false;
    else {
        $('.error').first().focus();
        return true;
    }
}

function validateSingleField(ob)
{    
    var pat = ob.attr('regex');
    if (!pat)
        return;
    var val = ob.val();
    var re = new RegExp(pat);
    var res = re.test(val);
    if (!res) {
        if (!ob.is('.error'))
            ob.addClass('error');
    }
    else {
        ob.removeClass('error');
    }
}

$(document).on('keyup', '.pat', function () {
    validateSingleField($(this));
});

