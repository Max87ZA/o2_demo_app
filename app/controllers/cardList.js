// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
function cardListClicked(e)
{
    var item = $.cardSection.getItemAt(e.itemIndex);
    item.itemIndex = e.itemIndex;
    var cardDetailController = Alloy.createController('cardDetail', item);
    $.navWindow.openWindow(cardDetailController.getView());
}

Alloy.Globals.events.on("detailClosed", function(e)
{
    if(e.properties.revealed == true)
    {
        e.cardNumber.text = e.properties.cardId;
        if(e.properties.activated == true)
        {
            e.cardStatus.text = "Activated";
        }
        else
        {
            e.cardStatus.text = "Revealed, not activated"
        }
        $.cardSection.updateItemAt(e.itemIndex, e);
    }
});