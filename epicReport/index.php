<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);

function get($url) {
	$authString = "brys.sepulveda:trevor12";
	$authString64 = base64_encode($authString);

	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		"Authorization: Basic $authString64",
		"Content-Type: application/json"
		));

	$responseData = curl_exec($curl);
	curl_close($curl);
	
	return $responseData;
}

$url = "http://trendy.ddns.net:2023/rest/api/latest/search?jql=type=Epic+AND+project=10802+AND+cf[10003]=%22To%20Do%22&maxResults=100";

$alltasksUrl = "http://trendy.ddns.net:2023/rest/api/latest/search?jql=project=Playverse+AND+%22Work%20Type%22=DEVELOPMENT+AND+type+in+(Story,Task,Sub-task)&fields=summary,status,customfield_10001,timeestimate,timeoriginalestimate,description,customfield_10705";

$responseData = get($url);
$responseAllTasks = get($alltasksUrl); //Returns only 50 by default

$allTasks = json_decode($responseAllTasks);
$total = (int)$allTasks->total;
//$total = 1; //DEBUGGING

$toWrite = array("issues" => array());


for ($i = 0; $i < ($total + 100); $i += 100) {
	$getUrl = $alltasksUrl . "&maxResults=100&startAt=" . $i;
	$resp = get($getUrl);
	$json = json_decode($resp);
	
	$toWrite["issues"][] = $json->issues;
}


$serverName = $_SERVER["SERVER_NAME"];
$serverPort = $_SERVER["SERVER_PORT"];

$resources = get("$serverName:$serverPort/resources.php");

?>


<html>
	<head>
		
		<title>Epic Report</title>
		<!-- DataTables CSS -->
		<link rel="stylesheet" type="text/css" href="http://cdn.datatables.net/1.10.5/css/jquery.dataTables.css">
		<link rel="stylesheet" type="text/css" href="css/dataTables.editor.min.css">
		  
		<!-- jQuery -->
		<script type="text/javascript" charset="utf8" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
		  
		<!-- DataTables -->
		<script type="text/javascript" charset="utf8" src="http://cdn.datatables.net/1.10.5/js/jquery.dataTables.js"></script>

		<!-- Data Tables Editor -->
		<script type="text/javascript" charset="utf8" src="js/dataTables.editor.min.js"></script>
		
		<script type="text/javascript" charset="utf8" src="js/epicReport.js"></script>
		
		<div id="replace" />
		
		<style>
			.center {
				text-align:center;
			}
			
			hr {
				margin: 20px 0;
			}
			
			.done {
				color:green;
			}
			
			.undone {
				color:red;
			}
			
			td.details-control {
				background: url('https://datatables.net/examples/resources/details_open.png') no-repeat center center;
				cursor: pointer;
			}
			tr.shown td.details-control {
				background: url('https://datatables.net/examples/resources/details_close.png') no-repeat center center;
			}
			
		</style>
		
	</head>
	<body>
		<script>
			console.log("Got back %s tasks", <?php echo $total; ?>);
			epicReportInfo.rawData = <?php echo $responseData ?>;
			epicReportInfo.rawTasks = <?php echo json_encode($toWrite) ?>;
			
			epicReportInfo.epics = epicReportInfo.rawData.issues;
			epicReportInfo.issues = epicReportInfo.rawTasks.issues;
			
			epicReportInfo.resources = <?php echo $resources ?>
			
			epicReportInfo.resources.mmmTax = getMMMTax(epicReportInfo.resources.personnel.length);
		
		</script>
		
		<div id="chart"></div>
		<hr/>
		<div id="resources"></div>
		<hr/>
		<div id="projections"></div>
		
		
		<script>
		
			var	epicReportData = getEpicReportData(); //Called here to generate the below variables
			var displayGlobalTotalTime = epicReportInfo.globalTotalTime / 60 / 60 + "h";
			var displayGlobalDoneTime = epicReportInfo.globalDoneTime / 60 / 60 + "h";
			var displayGlobalRemainingTime = (epicReportInfo.globalTotalTime - epicReportInfo.globalDoneTime) / 60 /60 + "h";
			var displayGlobalPercent = (epicReportInfo.globalDoneTime / epicReportInfo.globalTotalTime * 100).toFixed(1) + "%";
		
			$('#chart').html( '<table cellpadding="0" cellspacing="0" border="0" class="display compact" id="table"></table>' );
		 
			// Activate an inline edit on click of a table cell
			$('#table').on( 'click', 'tbody td:not(:first-child)', function (e) {
				var el = $(this);
				
				if (el.hasClass("editable-field"))
					return;
					
				epicReportEditor.inline( this );
			} );
 
			var epicReportTable = $('#table').DataTable( {
				dom: "Tfrtip",
				"pageLength" : -1,
				"data": epicReportData,
				stateSave: true,
				"columns": [
					{
						"width" : "4%",
						"className":      'details-control',
						"orderable":      false,
						"data":           null,
						"defaultContent": ''
					},
					{ "data":jiraConsts.priorityField, "title": "Rank", "width" : "4%", "class": "center"},
					{ "data":jiraConsts.versionField,"title": "Ver", "width" : "4%", "class": "center"},
					{ "data":jiraConsts.objectiveField,"title": "Objective", "width" : "10%"},
					{ "data":jiraConsts.subObjectiveField,"title": "SubObjective", "width" : "13%"},
					{ "data":jiraConsts.featureField,"title": "Feature", "width" : "10%" },
					{ "data":"key","title": "Key", "width" : "8%" },
					{ "data":jiraConsts.epicNameField,"title": "Name", "width" : "20%" },
					{ "data":"count","title": "Count", "width" : "15%" },
					{ "data":"time","width" : "7%", "title": displayGlobalDoneTime + " / " + displayGlobalTotalTime},
					{ "data":"percent","width" : "4%", "title": displayGlobalPercent},
					{ "data":"remaining","width" : "4%", "title": displayGlobalRemainingTime},
				]
			} );   
			
			$('#table tbody').on('click', 'td.details-control', function () {
				var tr = $(this).closest('tr');
				var row = epicReportTable.row( tr );
		 
				if ( row.child.isShown() ) {
					// This row is already open - close it
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					// Open this row
					row.child( epicReportChild(row.data()) ).show();
					tr.addClass('shown');
				}
			} );
			
			$('#resources').html( '<table cellpadding="0" cellspacing="0" border="0" class="display compact" id="resTable"></table>' );
		
			$('#resTable').dataTable( {
				"pageLength" : -1,
				"data": getResourcePlanningData(),
				stateSave: true,
				"columns": [
					{ "title": "Name", "class": "center"},
					{ "title": "Velocity", "class": "center"},
					{ "title": "Meeting Hours", "class": "center"},
					{ "title": "Qualifying Hours", "class": "center"},
					{ "title": "Support Triage Hours", "class": "center"},
					{ "title": "Review Hours", "class": "center"},
					{ "title": "QA Hours", "class": "center"},
					{ "title": "MMM Tax", "class": "center"},
					{ "title": "Scrum Ceremonies", "class": "center"},
					{ "title": "Projected Work", "class": "center"},
				]
			} ); 
			
			$('#projections').html( '<table cellpadding="0" cellspacing="0" border="0" class="display compact" id="projTable"></table>' );
		
			$('#projTable').dataTable( {
				"pageLength" : -1,
				"data": getProjectProjectionsData(new Date(2015, 02, 23)),
				stateSave: true,
				"columns": [
					{ "title": "Version", "class": "center"},
					{ "title": "Total Hours", "class": "center"},
					{ "title": "Holidays", "class": "center"},
					{ "title": "Vacation Days", "class": "center"},
					{ "title": "Emergent Work", "class": "center"},
					{ "title": "Total Weeks", "class": "center"},
					{ "title": "Total Months", "class": "center"},
					{ "title": "StartDate", "class": "center"},
					{ "title": "CompletetionDate", "class": "center"},
					{ "title": "RemainingCompletionDate", "class": "center"},
				]
			} ); 
		
		</script>
		<script src="/js/customEditor.js"></script>
	</body>
</html>
