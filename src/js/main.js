$(document).on('change', '.file input[type=file]', function() {
    if ( $(this)[0].files.length > 0 ) {
        $('.file .file-name').text( $(this)[0].files[0].name );
    }
});

const UploadFiles =
{
    random: function (max) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for( var i=0; i < max; i++ ){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },

    traversa: function (event) {

        var files;
        var uploadArea;

        // Nel caso di drop o di file on change
        if (event.currentTarget.tagName == "INPUT") {
            uploadArea = event.currentTarget.parentElement;
        } else {
            uploadArea = event.currentTarget;
        }

        // Nel caso di drop o di file on change
        if (event.originalEvent.dataTransfer != null) {
            files = event.originalEvent.dataTransfer.files;
        } else {
            files = event.originalEvent.srcElement.files;
        }

        if (typeof files !== "undefined") {
            var self = this;

    		$.each(files, function(index, file) {
    			self.upload(file, uploadArea);
    		});

    	}
    	else {
    		alert("Il tuo browser non è compatibile con il programma: aggiornalo!");
    	}
    },

    upload: function (file, uploadArea, uploadTable) {

    	var action = $(uploadArea).attr("data-action");
    	var type = $(uploadArea).attr("data-type");
    	var target = $(uploadArea).attr("data-target");
    	var random = this.random(10);
        var $row;

        jQuery.ajax({
            url: '/app/emptyUploadRow',
            success: function (result) {
                if (result) {
                    $row = $(result);
                }
            },
            async: false
        });

        $row.find(".td-filename a .name").text(file.name);
        $row.find('.td-mime').text(file.type);
        // $row.find('.file-size').text(Math.round(file.size/1000) + ' KB');

    	// var progressText = $('<center><span>0%</span></center>');
    	var progress = $('<progress class="progress is-info" value="" max="100"></progress>');

        // Cancello la riga no record
        $('.none').remove();

        // $row.find(".td-progress-cell").html(progressText);
        $row.find(".td-progress-cell").append(progress);
        $(target + '> tbody').prepend($row);

        // Creo un'istanza XMLHttpRequest
    	var xhr = new XMLHttpRequest();
    	// Progress bar
    	xhr.upload.addEventListener("progress", function (evt){
    		if (evt.lengthComputable){
    			var percentComplete = evt.loaded / evt.total;

                // progressBar.attr("style", "width:" + (evt.loaded / evt.total) * 100 + "%" );
                progress.attr("value", (evt.loaded / evt.total) * 100 );
                progress.text( (evt.loaded / evt.total) * 100 + "%" );
    			// progressText.text( parseInt(((evt.loaded / evt.total) * 100), 10) + " %" );
    		}
    	}, false);
        // Pagina caricata
    	xhr.addEventListener("load", function (msg) {
    		if (this.status == 200) {
                progress.attr("class", "progress is-success");
                // progressText.text("100%");

                $(uploadArea).removeClass("over");

                var res = $.parseJSON(msg.currentTarget.response);
                console.log(res);

				$row.attr("id", 'media-' + res.media_id);
				$row.find(".td-filename a.download-route").attr("href", res.download_route);
				$row.find(".td-filename a.show-route").attr("href", res.show_route);
				$row.find(".td-filename a.show-route .filename").text(res.filename);
                $row.find('.td-filename [name="temp_id[]"]').val(res.media_id);
				$row.find(".td-filename").attr('href', res.download_route);
                $row.find(".td-options .destroy").attr('data-url', res.delete_route);
                $row.find(".td-options .destroy").attr('data-title', res.filename);

                if (res.extra) {
                    if (res.extra.text) {
                        $row.find(".td-error").html(res.extra.text);
                    }
                    if (res.extra.class) {
                        $row.find(".td-error").addClass(res.extra.class);
                    }
                }
                if (res.extraRow) {
                    if(res.extraRow.html) {
                        $row.after('<tr class="'+res.extraRow.class+'"><td colspan="100">' + res.extraRow.html + '</td></tr>');
                    }
                }

                // Operazioni in ajax
                if (res.load){
                    $.each(res.load, function(i, value){
                        $.get(value.page, function(data){
                            if (value.prepend){
                                $(value.element).prepend(data);
                            } else if (value.replace){
                                $(value.element).replaceWith(data);
                            } else {
                                $(value.element).html(data);
                            }
                        });
                    });
                }
    		} else {
                progress.attr("class", "progress is-danger");
                if ( msg.currentTarget.response ) {
                    // progressText.text(msg.currentTarget.response);
                } else {
                    progressText.text("ERROR " + this.status);
                }
            }

            $("#empty-row").remove();
    	}, false);
        // Al termine dell'upload
    	xhr.addEventListener('readystatechange', function(e) {
    		// the transfer has completed and the server closed the connection.
    		if( this.readyState === 4 ) {
    			// $('[type="submit"]').prop("disabled", false);
    		}
    	});
        // Apro la richiesta
    	xhr.open("post", action, true);
    	// Imposto le intestazioni della richiesta
    	xhr.setRequestHeader("Content-Type", false);
        // CSRF
    	xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
    	// Urlencode per evitare errori di charset nel nome
    	xhr.setRequestHeader("X-File-name", encodeURIComponent(file.name));
    	xhr.setRequestHeader("X-File-Size", file.size);
    	xhr.setRequestHeader("X-File-Type", file.type);
    	// Invio il file alla pagina
    	xhr.send(file);
    }
}

$(function(){

	$(document).on("dragenter dragover", '.upload-box', function (event){
		event.preventDefault();
		event.stopPropagation();
		$(this).addClass("over");
	});

	$(document).on("dragleave", '.upload-box', function (event){
		event.preventDefault();
		event.stopPropagation();
		$(this).removeClass("over");
	});

	$(document).on("drop", '.upload-box', function (event){
		event.preventDefault();
		event.stopPropagation();

		// Il drop ha l'evento: dataTransfer
		UploadFiles.traversa(event);
	});

	$(document).on("change", '.upload-box > input[type="file"]', function (event){
		event.preventDefault();
		event.stopPropagation();

		// Il drop ha l'evento: srcElement
		UploadFiles.traversa(event);

        // Pulisco l'input per poter caricare anche lo stesso file
        $(this).val('');
	});

});
