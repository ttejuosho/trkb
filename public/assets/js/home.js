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
        appendSearchInput();
        if ($('#searchQuery0').length > 0 ){
            var dataObject = $('#searchQuery0')[0].selectize.options[value];     
        }

    }
});

$('#searchBy').selectize({
    onChange: function (value) {
        console.log(value);

        if (value === "transactionType"){
            fetch('/api/getTransactionTypes').then((data)=>{
                return data.json();
            }).then((res)=>{
                console.log(res);
                $('#searchQuery')[0].selectize.clearOptions();
                $('#searchQuery')[0].selectize.load(function (callback) { callback(res); });
                if ($('#searchQuery0').length > 0 ){
                    $('#searchQuery0')[0].selectize.clearOptions();
                }
                //appendSearchInput();
            })
        }

        if(value === "preparedBy"){
            fetch('/api/getAgents').then((data)=>{
                return data.json();
            }).then((res)=>{
                console.log(res);
                $('#searchQuery')[0].selectize.clearOptions();
                $('#searchQuery')[0].selectize.load(function (callback) { callback(res); });
                if ($('#searchQuery0').length > 0 ){
                    $('#searchQuery0')[0].selectize.clearOptions();
                }
                //appendSearchInput();
            })
        }

        if (value === "transactionTerminal"){
            fetch('/api/getTransactionTerminals').then((data)=>{
                return data.json();
            }).then((res)=>{
                console.log(res);
                $('#searchQuery')[0].selectize.clearOptions();
                $('#searchQuery')[0].selectize.load(function (callback) { callback(res); });
                if ($('#searchQuery0').length > 0 ){
                    $('#searchQuery0')[0].selectize.clearOptions();
                }

                //appendSearchInput();
            })
        }
    }
});

function appendSearchInput(){
    if ($('#searchQuery0').length < 1 ){
        let html = '<input type="text" id="searchQuery0" name="searchQuery0" class="form-control mb-2" placeholder="Search" value="">';
        $('#newInputDiv').append(html);
    } else {
        $('#searchQuery0')[0].selectize.clearOptions();
    }

    var searchBy = $('#searchBy').val();
    var searchQuery = $('#searchQuery').val();
    fetch(`/api/getTransactions/${searchBy}/${searchQuery}`).then((data)=>{
        return data.json();
    }).then((res)=>{
        console.log(res);
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
    });
}

let searchQuery2 = $('#searchQuery')[0].selectize.getValue();
console.log("poloikuj");