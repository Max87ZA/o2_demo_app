// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
function windowOpened()
{
    $.cardRevealedLabel.text = args.properties.cardId;
    checkStatus();
    $.scratchView.addEventListener("erase", function(e) {
        Ti.API.info("erase progress: "+JSON.stringify(e));
    });
    $.scratchView.addEventListener("touchstart", function(e) {
        Ti.API.info("touchstart progress: "+JSON.stringify(e));
    });
}
function checkStatus()
{
    if(args.properties.revealed == true)
    {
        $.scratchView.opacity = 0;
        $.autoRevealButton.enabled = false;
        $.autoRevealButton.color = "gray";

    }
    if(args.properties.activated == true)
    {
        $.activateCodeButton.enabled = false;
        $.activateCodeButton.color = "gray";
    }
}


var animationTimer;
var animationStarted = false;
function autoRevealClicked()
{
    animationStarted = true;
    animationTimer = new Date().getTime();
    $.scratchView.animate({opacity: 0, duration: 2000}, function()
    {
        Ti.API.info("animation complete");
        args.properties.revealed = true;
        checkStatus();
    });
}

function activateCodeClicked()
{
    if(args.properties.revealed == true)
    {
        $.loadingView.show();
        var xhr = Ti.Network.createHTTPClient();
        xhr.open("GET", "https://api.o2.sk/version?code="+args.properties.cardId);
        xhr.onload = function()
        {
            try
            {
                // var testResponse = JSON.stringify({"ios":"6.08", "iosTM":"1.22", "iosRA":"1.1401", "iosRA_2":"1.2000.1", "android":"179907", "androidTM":"22970", "androidRA":"161395"});
                // var testResponse = "notValidJSONText";
                var jsonResponse = JSON.parse(this.responseText);
                // var jsonResponse = JSON.parse(testResponse);
                setTimeout(function()
                {
                    $.loadingView.hide();
                    if(parseFloat(jsonResponse.ios) > 6.1)
                    {
                        $.cardActivatedAD.show();
                        args.properties.revealed = true;
                        args.properties.activated = true;
                        checkStatus();
                    }
                    else
                    {
                        $.cardNotActivatedAD.show();
                    }
                }, 0);
                
            }
            catch(e)
            {
                Ti.API.info("error parsing response: "+JSON.stringify(e));
                $.loadingView.hide();
                $.generalErrorAD.show();
            }
        };
        xhr.onerror = function(e)
        {
            Ti.API.info("error: "+JSON.stringify(e));
            $.loadingView.hide();
            $.generalErrorAD.show();
        };
        xhr.send();
    }
    else
    {
        $.cardNotRevealedAD.show();
    }
}

function checkAnimation()
{
    if(args.properties.revealed == false && animationStarted == true)
    {
        var windowCloseTime = new Date().getTime();
        var difference = windowCloseTime - animationTimer;
        Ti.API.info("difference: "+difference);
        if(difference > 2000)
        {
            args.properties.revealed = true;
        }
        Alloy.Globals.events.trigger("detailClosed", args);
    }
    else
    {
        Alloy.Globals.events.trigger("detailClosed", args);
    }
}