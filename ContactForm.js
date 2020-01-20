function NewSeoContact() {
    result = true;

    if (Required($('.validation-departments').val())) {
        $('.validation-departments').removeClass('field-custom-validation');
        $('.departmentsErrorMsg').text('');
    } else {
        $('.validation-departments').addClass('field-custom-validation');
        $('.departmentsErrorMsg').text('שדה חובה');
        return false;
    }

    // first name
    if (Required($('.validation-firstname').val())) {
        $('.validation-firstname').removeClass('field-custom-validation');
        $('.firstnameErrorMsg').text('');

        if (IsTextOnly($.trim($('.validation-firstname').val()))) {
            $('.validation-firstname').removeClass('field-custom-validation');
            $('.firstnameErrorMsg').text('');
        } else {
            $('.validation-firstname').addClass('field-custom-validation');
            $('.firstnameErrorMsg').text('אותיות בלבד');
            return false;
        }
    } else {
        $('.validation-firstname').addClass('field-custom-validation');
        $('.firstnameErrorMsg').text('שדה חובה');
        return false;
    }

    // last name 
    if (Required($('.validation-lastname').val())) {
        $('.validation-lastname').removeClass('field-custom-validation');
        $('.lastnameErrorMsg').text('');

        if (IsTextOnly($.trim($('.validation-lastname').val()))) {
            $('.validation-lastname').removeClass('field-custom-validation');
            $('.lastnameErrorMsg').text('');
        } else {
            $('.validation-lastname').addClass('field-custom-validation');
            $('.lastnameErrorMsg').text('אותיות בלבד');
            return false;
        }
    } else {
        $('.validation-lastname').addClass('field-custom-validation');
        $('.lastnameErrorMsg').text('שדה חובה');
        return false;
    }

    // phone 
    if (Required($('.validation-phone').val())) {
        $('.validation-phone').removeClass('field-custom-validation');
        $('.phoneErrorMsg').text('');

        if (IsPhone($('.validation-phone').val())) {
            $('.validation-phone').removeClass('field-custom-validation');
            $('.phoneErrorMsg').text('');
        } else {
            $('.validation-phone').addClass('field-custom-validation');
            $('.phoneErrorMsg').text('טלפון לא חוקי');
            return false;
        }
    } else {
        $('.validation-phone').addClass('field-custom-validation');
        $('.phoneErrorMsg').text('שדה חובה');
        return false;
    }

    if (Required($('.validation-areacode').val())) {
        $('.validation-areacode').removeClass('field-custom-validation');
        $('.phoneErrorMsg').text('');
    } else {
        $('.validation-areacode').addClass('field-custom-validation');
        $('.phoneErrorMsg').text('שדה חובה');
        return false;
    }

    if (Required($('.validation-email').val())) {
        $('.validation-email').removeClass('field-custom-validation');
        $('.emailErrorMsg').text('');

        if (IsEmail($('.validation-email').val())) {
            $('.validation-email').removeClass('field-custom-validation');
            $('.emailErrorMsg').text('');
            //result = true;
        } else {
            $('.validation-email').addClass('field-custom-validation');
            $('.emailErrorMsg').text('מייל לא חוקי');
            return false;
        }
    } else {
        $('.validation-email').addClass('field-custom-validation');
        $('.emailErrorMsg').text('שדה חובה');
        return false;
    }

    //if (result == true) {
        var askForWhat = $('.validation-departments').val();
        var company = $('.validation-company').val();
        var fullName = $('.validation-firstname').val() + ' ' + $('.validation-lastname').val()
        var phone = $('.validation-areacode').val() + '-' + $('.validation-phone').val();
        var email = $('.validation-email').val();
        var details = $('.validation-details').val();

        var webMethod = "service/SearchLightEngineService.asmx/NewContact";

        var askForWhatUrl = "";

        switch (askForWhat) {
            case "תקדין":
                askForWhatUrl = "takdin";
                break;
            case "תקדין לייט":
                askForWhatUrl = "takdinlite";
                break;
            case "שירות לקוחות":
                askForWhatUrl = "support";
                break;
            default:
                askForWhatUrl = "experience";
        }



        var parameters = "{'askForWhat':'" + askForWhat + "','company':'" + company + "','fullName':'" + fullName + "','phone':'" + phone + "','email':'" + email + "','details':'" + details + "'}";
        //var parameters = "{'company':'" + company + "','fullName':'" + fullName + "','phone':'" + phone + "','email':'" + email + "'}";

        $.ajax({
            type: "POST",
            url: webMethod,
            data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                window.location = "http://www.takdin.co.il/RequestConfirmation.aspx?status=true&department=" + askForWhatUrl;
            },
            error: function (e) {
                alert("Unavailable");
            }
        });
    //}
}



function IsEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;        
        return regex.test(email);
    }

    function IsPhone(phone) {
        //var regex = /^([0-9\-\(\)\s]+$)/;
        var regex = /^\d{7}$/;
        return regex.test(phone);
    }

    function IsTextOnly(text) {
        var regex = /^[A-zא-ת_ ]+$/;
        return regex.test(text);
    }


    function Required(item) {
        if (item.length > 0) {
            return true;
        }
        return false;
    }