var clip;

function displayAlert(txt, lvl) {
	$(".alert").alert('close');
	$("#alert").html("<div class=\"alert alert-" + lvl + "\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>"+txt+"</div>");
}

function enableEditMode() {
	var btn = $("#submit");
	$("input[type='checkbox']").attr("disabled", true);
	btn.attr("edit-mode", true);
	btn.removeClass("btn-primary").addClass("btn-warning");
	displayAlert("<strong>Warning!</strong> Edit mode activated, press Submit to save changes when done editing or press Submit now to return to normal mode.", "warning");
}

function disableEditMode() {
	var btn = $("#submit");
	$("#edit-check").removeAttr("disabled").removeAttr("checked");
	$("#edit-check").change();
	if($("#information").is(':checked')) {
		$("#information").removeAttr("disabled");
		$(".information-checkbox").each(function() {
			$(this).removeAttr("disabled");
		});
	}
	else if($("#welcome").is(':checked')) {
		$("#welcome").removeAttr("disabled");
		$(".welcome-checkbox").each(function() {
			$(this).removeAttr("disabled");
		});
	}
	btn.removeAttr("edit-mode");
	btn.removeClass("btn-warning").addClass("btn-primary");
	$("textarea").val("");
	displayAlert("<strong>Warning!</strong> Edit mode deactivated, changes, if any were made, have been saved.", "warning");
}

function getSuccessHandler(data) {
	var value = "";
	if($("#information").is(':checked')) {
		$(".information-checkbox").each(function() {
			if(data[$(this).attr("id")]) value += data[$(this).attr("id")];
		});
		if(data['information-signature']) value += data['information-signature'];
	}
	else if($("#welcome").is(':checked')) {
		$(".welcome-checkbox").each(function() {
			if(data[$(this).attr("id")]) value += data[$(this).attr("id")];
		});
		if(!data['edit-mode']) {
			value = value.replace("<name>", $("#first-name").val());
			value = value.replace("<username>", $("#username").val());
			value = value.replace("<password>", $("#fms").val());
		}
		if(data['welcome-signature']) value += data['welcome-signature'];
	}
	$("textarea").val(value);
	clip.setText(value);
	$("#submit").button("reset");
	if(data['edit-mode']) enableEditMode();
}

function updateSuccessHandler(data) {
	$("#submit").button("reset");
	disableEditMode();
}

function ajaxGet(json) {
	$.post(
		"",
		JSON.stringify(json),
		getSuccessHandler,
		"json"
	)
	.error(function() {
		$("#submit").button("reset");
	});
}

function ajaxUpdate(json) {
	$.post(
		"",
		JSON.stringify(json),
		updateSuccessHandler,
		"json"
	)
	.error(function() {
		$("#submit").button("reset");
	});
}

$("#information").change(function() { 
	if($(this).is(':checked')) {
		$("#welcome").attr("disabled", true);
		$(".information-checkbox").removeAttr("disabled");
	}
	else {
		$("#welcome").removeAttr("disabled");
		$(".information-checkbox").attr("disabled", true).removeAttr("checked");
	}
});

$("#welcome").change(function() { 
	if($(this).is(':checked')) {
		$("#information").attr("disabled", true);
		$("input").filter(".welcome-checkbox").removeAttr("disabled");
	}
	else {
		$("#information").removeAttr("disabled");
		$("#user-input").addClass("hide");
		$(".welcome-checkbox").attr("disabled", true).removeAttr("checked");
	}
});

$("#welcome-introduction").change(function() { 
	if($(this).is(':checked')) {
		if(!$("#edit-check").is(':checked')) $("#user-input").removeClass("hide");
	}
	else {
		$("#user-input").addClass("hide");
	}
});

$("#edit-check").change(function() { 
	if($(this).is(':checked')) {
		$("#user-input").addClass("hide");
	}
	else {
		if($("#welcome-introduction").is(':checked')) $("#user-input").removeClass("hide");
	}
});

$("#submit").on("click", function(e) {
	var errorPresent = false;
	e.preventDefault();
	$(".alert").alert('close');
	$(this).button("loading");
	if($("#edit-check").is(':checked')) {
		if($("#information").is(':checked')) {
			if($(".information-checkbox:checked").length > 1) {
				errorPresent = true;
				$(this).button("reset");
				displayAlert("<strong>Error!</strong> Can only check one box while edit mode selected.", "error");
			}
		}
		else if($("#welcome").is(':checked')) {
			if($(".welcome-checkbox:checked").length > 1) {
				errorPresent = true;
				$(this).button("reset");
				displayAlert("<strong>Error!</strong> Can only check one box while edit mode selected.", "error");
			}		
		}
	}
	if(!errorPresent) {
		if($("#information").is(':checked')) {
			var json = {'information-signature': 'Key'};
			if($("#edit-check").is(':checked')) json['edit-mode'] = 'Key';
			$(".information-checkbox:checked").each(function() {
				json[$(this).attr("id")] = 'Key';
			});
			if($("#edit-check").is(':checked') && (typeof $(this).attr("edit-mode") !== 'undefined' && $(this).attr("edit-mode") !== false)) {
				delete json['edit-mode'];
				if(Object.keys(json).length > 1) delete json['information-signature'];
				json[Object.keys(json)[0]] = $("textarea").val();
				if($("textarea").val() === "KeyNotFound") delete json[Object.keys(json)[0]];
				ajaxUpdate(json);
			}
			else {
				if($("#edit-check").is(':checked') && Object.keys(json).length > 2) delete json['information-signature'];
				ajaxGet(json);
			}
		}
		else if($("#welcome").is(':checked')) {
			var json = {'welcome-signature': 'Key'};
			if($("#edit-check").is(':checked')) json['edit-mode'] = 'Key';
			$(".welcome-checkbox:checked").each(function() {
				json[$(this).attr("id")] = 'Key';
			});
			if($("#edit-check").is(':checked') && (typeof $(this).attr("edit-mode") !== 'undefined' && $(this).attr("edit-mode") !== false)) {
				delete json['edit-mode'];
				if(Object.keys(json).length > 1) delete json['welcome-signature'];
				json[Object.keys(json)[0]] = $("textarea").val();
				if($("textarea").val() === "KeyNotFound") delete json[Object.keys(json)[0]];
				if(json['welcome-introduction']) {
					if(json['welcome-introduction'].split("<name>").length - 1 !== 1 || json['welcome-introduction'].split("<username>").length - 1 !== 1 || json['welcome-introduction'].split("<password>").length - 1 !== 1) {
						delete json['welcome-introduction'];
						$(this).button("reset");
						displayAlert("<strong>Error!</strong> Must be no more or less than one occurrence of &ltname&gt, &ltusername&gt, and &ltpassword&gt.", "error");
						return;
					}
				}
				else {
					if(Object.keys(json).length > 0 && (json[Object.keys(json)[0]].split("<name>").length - 1 !== 0 || json[Object.keys(json)[0]].split("<username>").length - 1 !== 0 || json[Object.keys(json)[0]].split("<password>").length - 1 !== 0)) {
						delete json[Object.keys(json)[0]];
						$(this).button("reset");
						displayAlert("<strong>Error!</strong> &ltname&gt, &ltusername&gt, and &ltpassword&gt can only be in the introduction.", "error");
						return;
					}
				}
				ajaxUpdate(json);
			}
			else {
				if($("#edit-check").is(':checked') && Object.keys(json).length > 2) delete json['welcome-signature'];
				ajaxGet(json);
			}
		}
		else {
			$(this).button("reset");
			displayAlert("<strong>Error!</strong> Must check either the Information or Welcome checkboxes.", "error");
		}
	}
});
