localStorage.removeItem('activeTab');

$('#locationUID').selectize({
    maxItems: 1,
    create: false,
    labelField: 'locationName',
    valueField: 'locationUID',
    searchField: 'locationName',
    render: {
        option: function (item, escape) {
            return '<div>' + escape(item.locationName) + '</div>';
        }
    }
});

$('#companyUID').keyup((e)=>{
    var value = e.target.value;
    console.log(value);
    if(value.length > 4){       
        console.log(`Getting locations for companyId ${value} ....`);
        fetch(`/api/getLocationsByCompany/${value}`).then((data)=>{
            return data.json();
        }).then((res)=>{
            if (res.length === undefined){
                $('#locationNameHelp').text(res.message);
            } else {
                if (res.length !== undefined && res.length > 0){
                    $('#locationUID')[0].selectize.clearOptions();
                    $('#locationUID')[0].selectize.addOption({ locationName: "Please choose a location", locationUID: "00" });
                    $('#locationUID')[0].selectize.load(function (callback) { callback(res); });
                    $('#locationUID')[0].selectize.setValue("00");
                } else {
                    $('#locationUID')[0].selectize.clearOptions();
                    $('#locationNameHelp').text("No locations found for the company Id entered, Please contact your Admin.");
                }
            }
        });
    } else {
        $('#locationUID')[0].selectize.clearOptions();
        $('#locationNameHelp').text("");
    }
})