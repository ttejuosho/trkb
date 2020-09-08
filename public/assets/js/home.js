
$('#searchQuery').selectize({
    maxItems: 1,
    create: true,
    labelField: 'value',
    valueField: 'value',
    searchField: 'value',
    render: {
        option: function (item, escape) {
            return '<div>' + escape(item.value) + '</div>';
        }
    },
    onChange: function (value) {
        console.log(value);
        if(value.length > 0){
            if($('#searchBy')[0].selectize.getValue() === 'transactionType' || $('#searchBy')[0].selectize.getValue() === 'transactionTerminal'){
                appendSearchInput();
            } else {
                $('#newInputDiv').empty();
            }
        }

        //var dataObject = $('#searchQuery')[0].selectize.options[value];
    }
});

$('#searchBy').selectize({
    onChange: function (value) {
        console.log(value);
        if(value.length > 0){ getDropdownData(value); }
    }
});

function getDropdownData(columnName){
    fetch(`/api/getDistinct/${columnName}`).then((data)=>{
        return data.json();
    }).then((res)=>{
        console.log(res);
        $('#searchQuery')[0].selectize.clearOptions();
        $('#searchQuery')[0].selectize.load(function (callback) { callback(res); });
    });
}

function resetInputs(res){
    $('#searchQuery')[0].selectize.clearOptions();
    $('#searchQuery')[0].selectize.load(function (callback) { callback(res); });
}

function appendSearchInput(){
    if ($('#searchQuery0').length < 1 ){
        let html = '<input type="text" id="searchQuery0" name="searchQuery0" class="form-control mb-2" placeholder="Search" value="">';
        $('#newInputDiv').append(html);
    } else {
        $('#searchQuery')[0].selectize.clearOptions();
    }

    var searchBy = $('#searchBy').val();
    var searchQuery = $('#searchQuery').val();
    fetch(`/api/getTransactions/${searchBy}/${searchQuery}`).then((data)=>{
        return data.json();
    }).then((res)=>{
        console.log(res);
        if ($('#searchQuery0')[0].selectize !== undefined ){
            $('#searchQuery0')[0].selectize.clearOptions();
            $('#searchQuery0')[0].selectize.load(function (callback) { callback(res); });
        } 
        else 
        {
            $('#searchQuery0').selectize({
                labelField: 'transactionUID',
                valueField: 'transactionUID',
                searchField: ['transactionUID', 'transactionType', 'transactionTerminal', 'amountReceived', 'amountPaid', 'customerName', 'preparedBy'],
                maxItems: 1,
                create: false,
                options: res,
                render: {
                    option: function (item, escape) {
                        return '<div>' + escape(item.transactionUID) + '</div>';
                    }
                },
                onChange: function(value){
                    console.log(value);
                }
            });
        }

    });
}

$("#goSearch").click(() => {
    if ($('#searchQuery0').length > 1){
        var queryInput = $('#searchQuery0')[0].selectize.getValue();
        var dataObject = $('#searchQuery0')[0].selectize.options[queryInput];
        console.log(dataObject);
        $('#resultsDiv').empty();
        appendDataTable(dataObject);
    } else if ($('#searchQuery')[0].selectize.getValue().length > 0 && $('#searchBy')[0].selectize.getValue().length > 0) {
        getSearchData();
    }

 

});

$(document).keypress(function (e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13' && $('#searchQuery')[0].selectize.getValue().length > 0) {
        getSearchData();
    }
});

function getSearchData(){
    event.preventDefault();
    $('#spinner').removeAttr('hidden');
    var searchQuery = $('#searchQuery')[0].selectize.getValue();
    var searchBy = $('#searchBy')[0].selectize.getValue();
    fetch(`/api/search/${searchBy}/${searchQuery}`).then((data) => {
        return data.json();
    }).then((res)=>{
        console.log(res);
        $('#resultsDiv').empty();
        res.results.forEach((dataObject)=>{
            appendDataTable(dataObject);
        });
    })
}

function appendDataTable(dataObject){
    var html = 
    `<div class="container">
    <div class="form-row justify-content-center">
        <div class="col-12 col-md-6 p-4 border mb-3">
            <table class="table table-striped">
                <thead></thead>
                <tbody>
                    <tr>
                        <th scope="row">Transaction Id:</th>
                        <td><a class="text-dark" href="/transaction/detail/${dataObject.transactionUID}">${dataObject.transactionUID}</a></td>
                    </tr>
                    <tr>
                        <th scope="row">Transaction Date:</th>
                        <td>${moment(dataObject.transactionDate).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    </tr>
                    <tr>
                        <th scope="row">Transaction Type:</th>
                        <td>${dataObject.transactionType}</td>
                    </tr>
                    <tr>
                        <th scope="row">Transaction Terminal:</th>
                        <td>${dataObject.transactionTerminal}</td>
                    </tr>
                    <tr>
                        <th scope="row">Agent Name:</th>
                        <td>${dataObject.preparedBy}</td>
                    </tr>
                </tbody>
            </table>
            <div class="text-right"><a href="/transaction/detail/${dataObject.transactionUID}">More Info</a></div>
        </div>
    </div>
</div>`;
$('#resultsDiv').append(html);
}