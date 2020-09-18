var agentsTable;
var locationsTable;

fetch(`/api/getAgents`).then((data)=>{
    return data.json();
}).then((res)=>{
    renderAgentsTable(res);
});

fetch(`/api/getLocations`).then((data)=>{
    return data.json();
}).then((res)=>{
    renderLocationsTable(res);
});

function fixNull(string){
    if(string === null){
        return "";
    }
    return string;
}

function renderLocationsTable(data){
    locationsTable = $('#locationsTable').DataTable({
        data: data,
        rowId: 'locationId',
        columns: [
            {
                className: 'locationName',
                data: 'locationName',
                render: function(data, type, row, meta){
                    return '<span>' + row.locationName + ' ('+ row.locationUID +')' +'</span>';
                }
            },
            {
                className: 'locationAddress',
                render: function(data, type, row, meta){
                    if(row.locationAddress === null && row.locationCity === null && row.locationState === null){
                        return '';
                    }
                    return '<span>' + row.locationAddress + ', ' + row.locationCity + ', ' + row.locationState + '</span>';
                }
            },
            {
                className: 'locationEmail',
                data: 'locationEmail'
            },
            {
                className: 'locationPhone',
                data: 'locationPhone'
            },
            {
                className: 'locationContactName',
                data: 'locationContactName'
            },
            {
                className: 'locationContactEmail',
                data: 'locationContactEmail'
            },
            {
                className: 'locationContactPhone',
                data: 'locationContactPhone'
            },
            {
                data: null,
                className: 'locationOptions',
                render: function(data, type, row, meta){
                    return '<button onclick="activateEditAgentModal(' + "'" + row.locationId + "'" + ')" data-toggle="modal" data-target="#editAgentModal" class="btn btn-warning mr-1"><i class="fas fa-edit"></i></button> <button onclick="activateEditLocationModal(' + "'" + row.locationId + "'" + ')" data-toggle="modal" data-target="#deleteLocationModal" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>';
                }
            }
        ]
    })
}

function renderAgentsTable(data){
    agentsTable = $('#agentsTable').DataTable({
        data: data,
        rowId: 'userId',
        columns:[
            {
                className: 'name',
                data: 'name'
            },
            {
                className: 'location',
                render: function(data, type, row, meta){
                    return '<span>' + row.locationName + ' ('+ row.locationUID +')' +'</span>';
                }
            },
            {
                className: 'emailAddress',
                data: 'emailAddress'
            },
            {
                className: 'phoneNumber',
                data: 'phoneNumber'
            },
            {
                data: null,
                className: 'agentsOptions',
                render: function(data, type, row, meta){
                    return '<button onclick="activateEditAgentModal(' + "'" + row.userId + "'" + ')" data-toggle="modal" data-target="#editAgentModal" class="btn btn-warning mr-1"><i class="fas fa-edit"></i></button> <button onclick="activateDeleteAgentModal(' + "'" + row.userId + "'" + ')" data-toggle="modal" data-target="#deleteAgentModal" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>';
                }
            }
        ]
    })


}

$('#newAgentBtn').on('click', ()=>{
    console.log('Opening new agent Modal ...');
});

$('#newLocationBtn').on('click', ()=>{
    console.log('Opening new location Modal ...');
});
