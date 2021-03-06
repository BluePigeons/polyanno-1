
////

/////GLOBAL VARIABLES


var websiteAddress;

var polyanno_minimising = true;

var polyanno_current_username;

var imageSelected; //info.json format URL
var imageSelectedMetadata = []; ////???


////HTML VARIABLES



var polyanno_select_fragment_symbol = "<span class='glyphicon glyphicon-scissors'></span> <span class='glyphicon glyphicon-text-background'></span>";
var polyanno_discuss_symbol = "<span class='glyphicon glyphicon-comment'></span>";
var polyanno_new_anno_symbol = "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-plus'></span>";
var polyanno_fragment_alternatives_symbol = "<span class='glyphicon glyphicon-text-background'></span> <span class='glyphicon glyphicon-align-left'></span>";
var polyanno_merging_vectors_symbol = "<span class='glyphicon glyphicon-map-marker'></span> <span class='glyphicon glyphicon-stop'></span> <span class='glyphicon glyphicon-object-align-horizontal'></span>";
var polyanno_linking_transcription_to_vectors_symbol = "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-list-alt'></span> <span class='glyphicon glyphicon-stop'></span>";
var polyanno_linking_translation_to_vectors_symbol = "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-globe'></span></span> <span class='glyphicon glyphicon-stop'></span>";
var polyanno_show_alternatives_symbol = `<span class="glyphicon glyphicon-chevron-down"></span> <span class="glyphicon glyphicon-text-background"></span> <span class="glyphicon glyphicon-align-left"></span>`;




var polyanno_image_viewer_HTML = `
  <div id='polyanno_map' class="row"></div>
  <div class="polyanno-resize-s ui-resizable-s ui-resizable-handle"></div>
  `;


var closeButtonHTML = `<span class='closePopoverMenuBtn glyphicon glyphicon-remove'></span>`;

var transcriptionIconHTML = `<span class='glyphicon glyphicon-list-alt'></span>
                            <span>Transcription</span>`;
var translationIconHTML = `<span class='glyphicon glyphicon-globe'></span>
                            <span>Translation</span>`;


var polyannoEditorHandlebarHTML = `
      <button class="btn polyanno-options-dropdown-toggle dragondrop-handlebar-obj polyanno-colour-change col-md-2" type="button" >
          <span class="glyphicon glyphicon-cog"></span>
          <span class="caret"></span>
      </button>
`;
var polyannoEditorHTML_partone = `

  <div class="textEditorMainBox row ui-content">
    <div class="col-md-12">

`;

////need to change to discussion and put tags into Polyglot alone
var polyannoEditorHTML_options_partone = `<div class="row polyanno-options-row">
                                            <div class="col-md-2 polyanno-options-buttons">
                                              <button class="btn btn-default polyanno-metadata-tags-btn"><span class="glyphicon glyphicon-tags"></span></button>
                                            </div>`;
var polyannoEditorHTML_options_parttwo = `</div>`;

var polyannoEditorHTML_options = polyannoEditorHTML_options_partone + polyannoEditorHTML_options_parttwo;

var polyannoVotingRow1 = `
  <div class='polyanno-voting-overlay'>
    <button type='button' class='btn btn-default voteBtn polyannoVotingUpButton'>
      <span class='glyphicon glyphicon-thumbs-up' aria-hidden='true' ></span>
    </button>
    <button disabled type='button' class='btn btn-default polyannoVotesUpBadge'>
      <span class='badge'>
`;

var polyannoVotingRow2 = `
      </span>
    </button>
  </div>
`;

var polyannoEditorHTML_partfinal = `
      <div class="row polyanno-vector-link-row">
        <button type="button" class="btn polyannoEditorDropdownBtn polyannoLinkVectorBtn">
          <span class="glyphicon glyphicon-plus"></span>
          <span class="glyphicon glyphicon-stop"></span>
        </button> 
      </div>

      <div class="row polyanno-top-voted polyanno-text-display">
      
      </div>

      <div class="row polyanno-alternatives-toggle-row">
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoToggleAlternatives '>
          `+polyanno_show_alternatives_symbol+`
        </button> 
      </div>

      <div class="row polyanno-list-alternatives-row">

      </div>

      <div class="row polyanno-add-new-row">
        <div class='polyannoAddNewContainer col-md-12'> 
          <textarea id='testingKeys' class='newAnnotation row' placeholder='Add new annotation text here'></textarea><br>
          <button type='button' class='btn addAnnotationSubmit polyannoEditorDropdownBtn row'><span class='glyphicon glyphicon-ok-circle'></span></button>  
        </div> 

      </div>

      <div class="row polyanno-add-new-toggle-row">
        <button type="button" class="btn polyannoEditorDropdownBtn polyannoAddAnnotationToggle">
          `+polyanno_new_anno_symbol+`
        </button> 
      </div>

      <div class="row polyanno-add-new-cancel-row">
        <button type='button' class='btn polyannoEditorDropdownBtn polyannoAddAnnotationCancel'>
          Cancel 
        </button> 
      </div>

      <div class="row polyanno-metadata-tags-row">

      </div>

    </div>
  </div>
`;



////POLYANNO OBJECTS

var Polyanno =  {
  urls : {},
  colours : {},
  HTML : {},
  intEffects: {},
  starting: {},
  textHighlighting: {}
};

var rejectionOptions = new Set(["false",'""' , null , false , 'undefined','']);
var $langSelector = false;
var $imeSelector = false;
atu_the_input = $("#polyanno-dummy-textarea");


/////GENERIC FUNCTIONS

var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  }
};

var getTargetJSON = function(target, callback_function) {

  if ( isUseless(target) ) { return null;  }
  else if (target.includes(Polyanno.urls.annotation)) {
    return Polyanno.annotations.getById(target);
  }
  else if (target.includes(Polyanno.urls.vector)) {
    return Polyanno.vectors.getById(target);
  }
  else if (target.includes(Polyanno.urls.transcription)) {
    return Polyanno.transcriptions.getById(target);
  }
  else if (target.includes(Polyanno.urls.translation)) {
    return Polyanno.translations.getById(target);
  };  

};

var updateAnno = function(targetURL, targetData, callback_function) {

  var thisAnno = getTargetJSON(targetURL);
  thisAnno.update(targetData);
  if (!isUseless(callback_function)) {  callback_function();  };

};

var fieldMatching = function(searchArray, field, fieldValue) {
  if (isUseless(searchArray) || isUseless(field) || isUseless(fieldValue)) {  return false;  }
  else {
    var theMatch = false; 
    searchArray.forEach(function(childDoc){
      if ((childDoc[field] == fieldValue) || (new RegExp(fieldValue).test(childDoc[field])) ) {
          theMatch = childDoc;
      };
    });
    return theMatch;
  };
};

var asyncPush = function(addArray, oldArray) {
    var theArray = oldArray;
    var mergedArray = function() {
        addArray.forEach(function(addDoc){
            theArray.push(addDoc);
        });
        if (theArray.length = (oldArray.length + addArray.length)) {
            return theArray;
        };
    };
    return mergedArray();
};

var arrayIDCompare = function(arrayA, arrayB) {
  return arrayA.forEach(function(doc){
    var theCheck = fieldMatching(arrayB, "id", arrayA.id);
    if (  isUseless(theCheck) ) { return false }
    else {
      return [doc, theCheck];
    };
  });
};

var findField = function(target, field) {
  if ( isUseless(field) || isUseless(target) || isUseless(target[field])  ) {  return false  } 
  else {  return target[field] }; 
};

var checkFor = function(target, field) {
  var theChecking = getTargetJSON(target);
  return findField(theChecking, field);
};

var searchCookie = function(field) {
  var fieldIndex = document.cookie.lastIndexOf(field);
  if (fieldIndex == -1) {  return false;  }
  else {
    var postField = document.cookie.substring(fieldIndex+field.length);
    var theValueEncoded = postField.split(";", 1);
    var theValue = theValueEncoded[0];
    return theValue;
  };
};

var findByID = function(array, id) {
  if (isUseless(array[0])) {  return [];  }
  else {
    return $.grep(array, function(item){
      return item.id == id;
    });
  };
};

var arraySearchReplace = function(annoField, doc) {
  var existing = findByID(annoField, doc.id);
  if (existing.length > 0) {
    var index = annoField.indexOf(existing[0]);
    annoField.splice(index, 1, doc);
    return annoField;
  }
  else {
    return false;
  };
};

var annoCheckType = function(anno, type) {
  if (anno instanceof type) {
    return true;
  }
  else {
    console.error("TypeError: Polyanno[annos] must contain Polyanno[anno] Objects.");
    return false;
  };
};

var searchingUnknownByID = function(id) {
  var type;
  for (url in Polyanno.urls) {  if (id.includes(Polyanno.urls[url])) { 
    type = url; 
    var coll = type.concat("s");
    var obj = Polyanno[coll].getById(id);
    return obj;
  } };
  return false;
};

var replaceChildText = function(oldText, spanID, newInsert, oldInsert) {
    var idIndex = oldText.indexOf(spanID);
    var startIndex = oldText.indexOf(oldInsert, idIndex);
    var startHTML = oldText.slice(0, startIndex);
    var EndIndex = startIndex + oldInsert.length;
    var endHTML = oldText.substring(EndIndex);
    var newText = startHTML + newInsert+ endHTML;
    return newText;
};

var findClassID = function(classString, IDstring) {
  var IDindex = classString.search(IDstring) + IDstring.length;
  var IDstart = classString.substring(IDindex);
  var theID = IDstart.split(" ", 1);
  return theID[0];
};

var checkForVectorTarget = function(theText) {

  var theAnno = Polyanno.getAnnotationByBody(theText);
  var targetSearch =  fieldMatching(theAnno.target, "format", 'image/SVG');
  return targetSearch.id;  

};

var polyanno_annos_of_target = function(target, baseType, callback_function) {
  var data = Polyanno.getAnnotationsByTarget(target, baseType, true);

  var bodies = [];
  for (var i=0; i< data.length; i++) { 
    bodies.push(data[i].body); 
  };
  if (!isUseless(callback_function)) {    callback_function(bodies);  }
  else { return bodies; };
};


//////////////////URLS

Polyanno.urls = {
    "vector": window.location.host + "/api/vectors/",
    "transcription": window.location.host + "/api/transcriptions/",
    "translation": window.location.host + "/api/translations/",
    "annotation": window.location.host + "/api/annotations/"
};

/////Methods

//check for url

//if no DB then handle AJAX requests throughout Polyanno

///////////////////Colours

Polyanno.colours = {
  larger_vector: "green",
  highlight: {
    editor: "#EC0028",
    vector: "#EC0028",
    span: "#EC0028"
  },
  default: {
    editor: "buttonface",
    vector: "#03f",
    span: "transparent"
  },
  processing: {
    editor: "yellow",
    vector: "yellow",
    span: "yellow"
  },
  highlightThis: {},
  buildingParents: {
    annos: {},
    vector: {}
  }
};

/////Methods

Polyanno.colours.highlightThis.vector = function(chosenVector, colourChange) {

  Polyanno.L.vectors.eachLayer(function(l){
    if (l._leaflet_id == chosenVector) {
      l.setStyle({color: colourChange});
    }
  });

};

Polyanno.colours.highlightThis.editor = function(chosenEditor, colourChange) {
  chosenEditor.DOM.find(".polyanno-colour-change").css("background-color", colourChange);
};

Polyanno.colours.highlightThis.span = function(chosenSpan, colourChange) {
  chosenSpan.css("background-color", colourChange);
};

Polyanno.colours.connectColours = function(object, type, action) {
  Polyanno.colours.highlightThis[type](object, Polyanno.colours[action][type]);
  switch (type) {
    case "editor": 

      var vec = object.docs.vectors[0];
      if (!isUseless(vec)) { Polyanno.colours.highlightThis.vector(vec.id, Polyanno.colours[action]["vector"]); };

      var transcriptionSpan = object.docs.transcriptions[0];
      if (!isUseless(transcriptionSpan)) { 
        var targets = polyanno_annos_of_target(transcriptionSpan.id, "translation");
        for (var i=0; i < targets.length; i++) {
          var o = document.getElementById(targets[i]._id);
          if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
        };
      };

      var translationSpan = object.docs.translations[0];
      if (!isUseless(translationSpan)) { 
        var targets = polyanno_annos_of_target(translationSpan.id, "transcription");
        for (var i=0; i < targets.length; i++) {
          var o = document.getElementById(targets[i]._id);
          if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
        };
      };      
      break;

    case "vector":

      var ed = Polyanno.editors.findOneByDoc(object, "vectors");
      if (!isUseless(ed)) { Polyanno.colours.highlightThis.editor(ed, Polyanno.colours[action]["editor"]); };

      var targets = polyanno_annos_of_target(object);
      for (var i=0; i < targets.length; i++) {
        var o = document.getElementById(targets[i]._id);
        if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
      };
      break;

    case "span":
      var base;
      var opp;
      if (object.closest(".polyanno-text-display").hasClass("transcription-text")) {  base = "transcription"; opp = "translation"; }
      else {  base = "translation";  opp = "transcription"; };
      var plural = base.concat("s");
      var id = Polyanno.urls[base].concat(object.attr("id"));

      var ed = Polyanno.editors.findOneByDoc(id, plural); 
      if (!isUseless(ed)) { Polyanno.colours.highlightThis.editor(ed, Polyanno.colours[action]["editor"]); }; 

      ////vectors

      var check = Polyanno[plural].getById(id);
      if (!isUseless(check)) {
        var targets = polyanno_annos_of_target(id, opp);
        for (var i=0; i < targets.length; i++) {
          var o = document.getElementById(targets[i]._id);
          if (o != null) { Polyanno.colours.highlightThis.span($(o), Polyanno.colours[action]["span"]); };
        };
      };
      break;
    };
};


Polyanno.colours.buildingParents.annos.mouseover = function(new_frag_id) {
  JQUIspan = $("#"+new_frag_id);

  JQUIspan
  .css("background-color", Polyanno.colours.processing.span)
  .css("opacity", 1.0)
  .css("border", "none");

  JQUIspan.parent().on("mouseleave", function(event){
    JQUIspan
    .css("background-color", Polyanno.colours.default.span)
    .css("opacity", 0.7)
    .css("border", "3px solid #e3e3e5");
  });
};

Polyanno.colours.buildingParents.vector.mouseover = function(theIndex){

  if (theIndex != -1) {

    var n = theIndex + 1;

    Polyanno.colours.highlightThis.vector(Polyanno.buildingParents.vectors[theIndex], Polyanno.colours.processing.vector);

    $("#polyanno_merging_transcription > a:nth-child("+n+")")
    .css("background-color", Polyanno.colours.processing.span)
    .css("opacity", 1.0)
    .css("border", "none");

    $("#polyanno_merging_translation > a:nth-child("+n+")").children()
    .css("background-color", Polyanno.colours.processing.span)
    .css("opacity", 1.0)
    .css("border", "none");
  };

};

Polyanno.colours.buildingParents.vector.mouseout = function(theIndex){

  if (theIndex != -1) {

    var n = theIndex + 1;

    Polyanno.colours.highlightThis.vector(Polyanno.buildingParents.vectors[theIndex], Polyanno.colours.default.vector);

    $("#polyanno_merging_transcription > a:nth-child("+n+")")
    .css("background-color", Polyanno.colours.default.span)
    .css("opacity", 0.7)
    .css("border", "3px solid #e3e3e5");

    $("#polyanno_merging_translation > a:nth-child("+n+")")
    .css("background-color", Polyanno.colours.default.span)
    .css("opacity", 0.7)
    .css("border", "3px solid #e3e3e5");

  };

};

Polyanno.starting.highlighting = function() {

  $('#polyanno-page-body').on("mouseenter", ".textEditorBox", function(event){

    var thisEditorDOM = $(event.target).closest(".textEditorPopup");
    var id = thisEditorDOM.attr("id");
    var thisEditor = Polyanno.editors.getById(id);
    thisEditor.setSelected();

    Polyanno.colours.connectColours(thisEditor, "editor", "highlight");

    thisEditorDOM.on("mouseover", ".opentranscriptionChildrenPopup", function(event){
      if (!Polyanno.buildingParents.status) {
        var thisSpan = $(event.target);
        Polyanno.colours.connectColours(thisEditor, "editor", "default");
        Polyanno.colours.connectColours(thisSpan, "span", "highlight");
      }
      else {
        Polyanno.colours.buildingParents.annos.mouseover(thisSpan, "transcription");
      };
    });

    thisEditorDOM.on("mouseout", ".opentranscriptionChildrenPopup", function(event){
      var thisSpan = $(event.target);
      Polyanno.colours.connectColours(thisSpan, "span", "default");
      Polyanno.colours.connectColours(thisEditor, "editor", "highlight");
    });  

  });

  $('#polyanno-page-body').on("mouseleave", ".textEditorBox", function(event){

    Polyanno.selected.reset();
    var thisEditorDOM = $(event.target).closest(".textEditorPopup");
    var id = thisEditorDOM.attr("id");
    var thisEditor = Polyanno.editors.getById(id);

    Polyanno.colours.connectColours(thisEditor, "editor", "default");
  });

  Polyanno.L.vectors.on('mouseover', function(vec) {
    if (!Polyanno.buildingParents.status) {
      Polyanno.colours.connectColours(vec.layer._leaflet_id, "vector", "highlight");
    }
    else {
      var ind = Polyanno.buildingParents.vectors.indexOf(vec.layer);
      Polyanno.colours.buildingParents.vector.mouseover(ind);
    };
  });
  Polyanno.L.vectors.on('mouseout', function(vec) {
    if (!Polyanno.buildingParents.status) {
      Polyanno.colours.connectColours(vec.layer._leaflet_id, "vector", "default");
    }
    else {
      var ind = Polyanno.buildingParents.vectors.indexOf(vec.layer);
      Polyanno.colours.buildingParents.vector.mouseout(ind);
    };
  });

};


///////////////////HTML

Polyanno.HTML = {
  symbols: {},
  popups: {},
  connectingEquals: {},
  buildingParents: {}
};

Polyanno.HTML.symbols = {
    transcription: "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-list-alt'></span>",
    translation: "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-globe'></span>",
    discussion: "<span class='glyphicon glyphicon-comment'></span>",
    textHighlightingCut: "<span class='glyphicon glyphicon-scissors'></span> <span class='glyphicon glyphicon-text-background'></span>",
    textHighlightingOthers: "<span class='glyphicon glyphicon-text-background'></span> <span class='glyphicon glyphicon-align-left'></span>",
    textHighlighting: {
      transcription: "<span class='glyphicon glyphicon-align-left'></span> <span class='glyphicon glyphicon-list-alt'></span>",
      translation: "<span class='glyphicon glyphicon-align-left'></span> <span class='glyphicon glyphicon-globe'></span>"
    },
    newAnnotation: "<span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-plus'></span>",
    buildingParents: "<span class='glyphicon glyphicon-stop'></span> <span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-stop'></span>",
    buildingParent: {
      transcription: "<span class='glyphicon glyphicon-list-alt'></span> <span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-list-alt'></span>",
      translation: "<span class='glyphicon glyphicon-globe'></span> <span class='glyphicon glyphicon-link'></span> </span><span class='glyphicon glyphicon-globe'></span>"
    },
    connectingEquals:{
      transcription: "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-list-alt'></span> <span class='glyphicon glyphicon-stop'></span>",
      translation: "<span class='glyphicon glyphicon-link'></span> <span class='glyphicon glyphicon-globe'></span></span> <span class='glyphicon glyphicon-stop'></span>"
    },
    showAlternatives: "<span class='glyphicon glyphicon-chevron-down'></span> <span class='glyphicon glyphicon-text-background'></span> <span class='glyphicon glyphicon-align-left'></span>",
};

Polyanno.HTML.popups = {

    connectingEquals: `
      <div id="connectingEqualsMenu" class="popupAnnoMenu">
        <a class="btn btn-default polyanno-standard-btn" onclick="polyanno_setting_selecting_vector(); Polyanno.L.map.closePopup();">Submit</a>
        <a class="btn btn-default polyanno-standard-btn" onclick="polyanno_reset_selecting_vector(); Polyanno.L.map.closePopup();">Cancel</a>
      </div>
    `,

    textHighlighting: {
      transcription: `
        <div id="popupTranscriptionNewMenu" class="popupAnnoMenu">
           <div data-role="main" class="ui-content">
              <a class="openTranscriptionMenuNew transcriptionTarget editorPopover btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.transcription+`</a></br>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
           </div>
        </div>
      `,

      translation: `
        <div id="popupTranslationNewMenu" class="popupAnnoMenu" >
            <div data-role="main" class="ui-content">
              <a class="openTranslationMenuNew translationTarget editorPopover ui-btn ui-corner-all polyanno-standard-btn">`+Polyanno.HTML.symbols.translation+`</a></br>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
            </div>
        </div>  
      `
    },
    children: {
      transcription: `
        <div id="popupTranscriptionChildrenMenu" class="popupAnnoMenu">
            <div data-role="main" class="ui-content">
              <a class="openTranscriptionMenuOld editorPopover btn btn-default polyanno-standard-btn" >`+Polyanno.HTML.symbols.textHighlighting.transcription+`</a>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
            </div>
        </div>
      `,
      translation: `
        <div id="popupTranslationChildrenMenu" class="popupAnnoMenu">
            <div data-role="main" class="ui-content">
              <a class="openTranslationMenuOld editorPopover btn btn-default polyanno-standard-btn" >`+Polyanno.HTML.symbols.textHighlighting.translation+`</a>
              <a class="polyanno-add-discuss btn btn-default polyanno-standard-btn">`+Polyanno.HTML.symbols.discussion+` Discuss</a>
            </div>
        </div>
      `
    }

};




Polyanno.HTML.buildingParents = {
    Transcriptions : `
                                      <div id="polyanno_merging_transcription" class="row"></div>`,
    Translations : `
                                      <div id="polyanno_merging_translation" class="row"></div>`
};

///

var openHTML = "<div class='popupAnnoMenu'>";
var transcriptionOpenHTML = `<a class="openTranscriptionMenu polyanno-standard-btn btn btn-default" onclick="Polyanno.editors.ifOpen('transcription');
      Polyanno.L.map.closePopup();">`+Polyanno.HTML.symbols.transcription+`</a><br>`;
var translationOpenHTML = `<a class="openTranslationMenu polyanno-standard-btn btn btn-default" onclick="Polyanno.editors.ifOpen('translation');
      Polyanno.L.map.closePopup();">`+Polyanno.HTML.symbols.translation+`</a>`;
var endHTML = "</div>";
var popupVectorMenuHTML = openHTML + transcriptionOpenHTML + translationOpenHTML + endHTML;

var polyanno_top_bar_HTML = `

      <div class="btn-group polyanno-other-top-buttons" role="group" aria-label="...">

        <button data-hypothesis-trigger class="btn btn-default polyanno-discussion-btn"><span class="glyphicon glyphicon-comment"></span></button>

        <button id="polyanno-merge-shapes-enable" class="btn btn-default polyanno-merge-shapes-btn disabled" disable>
          `+Polyanno.HTML.symbols.buildingParents+`
        </button>

        <div class="btn-group polyanno-merging-buttons" role="group" aria-label="polyanno-merging-buttons">

              <button class="btn btn-primary polyanno-merge-shapes-submit-btn">Submit</button>

              <button class="btn btn-primary polyanno-merge-shapes-cancel-btn">Cancel</button>

              <button class="btn btn-primary polyanno-merge-transcriptions-btn">`+Polyanno.HTML.symbols.buildingParent.transcription+`</button>

              <button class="btn btn-primary polyanno-merge-translations-btn">`+Polyanno.HTML.symbols.buildingParent.translation+`</button>

        </div>

        <div id="polyanno-toplayer-slidecontainer">
          <input type="range" min="1" max="2" value="1" class="slider" id="polyanno-toplayer-range" style="display: none;">
        </div>

        <!-- <button class="btn btn-default atu-custom-keyboard-btn" type="button">
          <span class="glyphicon glyphicon-asterisk"></span>
          <span class="glyphicon glyphicon-th"></span><span class="glyphicon glyphicon-th"></span>
        </button>

        <div class="btn-group atu-custom-keyboard-buttons" role="group" aria-label="polyanno-merging-buttons" >

              <button class="btn btn-primary atu-custom-keyboard-new-btn">          
                <span class="glyphicon glyphicon-plus"></span>
                <span class="glyphicon glyphicon-asterisk"></span>
              </button>

              <button class="btn btn-primary atu-display-custom-keyboards-btn disabled" disabled>
                <span class="glyphicon glyphicon-asterisk"></span>
                <span class="glyphicon glyphicon-triangle-bottom"></span>
              </button>

        </div> -->

      </div>

      <!-- <div class="btn-group polyanno-language-buttons" role="group" aria-label="...">

        <button class="btn btn-default polyanno-add-keyboard" type="button">
          <span class="glyphicon glyphicon-plus"></span>
          <span class="glyphicon glyphicon-th"></span><span class="glyphicon glyphicon-th"></span>
        </button> 

        <button class="btn btn-default polyanno-add-ime polyanno-IME-options-closed" type="button">
          <span class="glyphicon glyphicon-transfer"></span>
          <span class="glyphicon glyphicon-th"></span><span class="glyphicon glyphicon-th"></span>
        </button> 

      </div> -->

      <div class="polyanno-enable-IME">

      </div>

      <!--this is here to be cloned-->
      <div class="polyanno_outer_merging_cursor">
        <div class="arrow-left"></div>
        <div class="polyanno_merging_cursor">
          <span>Drag and drop keys to the new keyboard.</span>
        </div>
      </div>

  </div>

  <!-- The end of the first row containing buttons and start of new -->

  <div class="row">
    <div class="col-md-12 dragondrop-min-bar">

    </div>

`;

var polyanno_merging_mousemove_HTML = `<span>Select each shape in order to join them.</span>`;

var polyanno_merging_added_shape_HTML = `<span>Click to unselect this shape.</span>`;

var polyanno_merging_new_shape_HTML = `<span>Click to link this shape.</span>`;

/////Methods




////////////EventEmitterObject

var PolyannoEventEmitter = function(opts) {
  var self = this;

  self.listeners = {};

  self.on = function(event_name, callback) {
    if (!(event_name in self.listeners)) {
      self.listeners[event_name] = [];
    };
    self.listeners[event_name].push(callback); 
  };

  self.trigger = function(event) {
    var self = this;
    if (!(event.type in self.listeners)) {
      return true;
    }
    var stack = self.listeners[event.type];
    event.target = self;
    for (var i = 0; i < stack.length; i++) {
      stack[i].call(self, event.detail);
    }
    return !event.defaultPrevented;
  };

  self.unbind = function(type, callback) {
    if (!(type in this.listeners)) {
      return;
    }
    var stack = this.listeners[type];
    for (var i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback){
        stack.splice(i, 1);
        return;
      }
    }
  };

};


////////////////// Events

var PolyannoEvent = function(values) {
  this.type = values.type;
  var obj = values.object;
  this.detail = {
      time: values.timestamp,
      object: obj
      //user: values.user
    };
};


/////////////Collections (Plural)

Polyanno.collections = function(type) {
  var self = this;
  self.type = type;
  self.array = [];

  PolyannoEventEmitter.call(self);

};


///Methods

Polyanno.collections.prototype.add = function(anno) {

  var self = this;

  var oldArr = [].concat(this.array);
  var type = this.type;
  if (annoCheckType(anno, type)) {  oldArr.push(anno);  };
  this.array = oldArr;

  var ev = new PolyannoEvent({
    type: "polyanno_created",
    object: anno,
    timestamp: new Date()
  });

  self.trigger(ev);
};

Polyanno.collections.prototype.replaceOne = function(anno) {
  var oldArr = this.array;
  var newArr = arraySearchReplace(oldArr, anno);

  var ev1 = new PolyannoEvent({
    type: "polyanno_updating",
    object: this,
    timestamp: new Date()
  });
  this.trigger(ev1);

  this.array = newArr;
};

Polyanno.collections.prototype.getById = function(the_id) {
  var arr = this.array;
  var thesearch = findByID(arr, the_id)[0];
  return thesearch;
};

Polyanno.collections.prototype.deleteAll = function() {
  var coll = this;

  ///triggering event for whole collection
  var ev = new PolyannoEvent({
    type: "polyanno_deleting",
    object: coll,
    timestamp: new Date()
  });
  this.trigger(ev);

  //triggering deleting event for each individual object
  for (var i=0; i < coll.array.length; i++) {
    var anno = coll.array[i];
    var ev1 = new PolyannoEvent({
      type: "polyanno_deleting",
      object: anno,
      timestamp: new Date()
    });
    anno.trigger(ev1); ////
  };

  this.array = [];
};

Polyanno.collections.prototype.getAll = function() {
  return this.array;
};


/////////////////Annotation (Singular)

var PAnnoSubDoc = function(value) {

  for (var prop in value) {
    if (prop == "format") {
      this.format = value.format;
    };
    if ((prop == "language") && (typeof value.language == Array)) {
      this.language = value.language;
    };
    if (prop == "processingLanguage") {
      this.processingLanguage = value.processingLanguage;
    };
    if ((prop == "type") && (typeof value.type == Array)) {
      this.type = value.type;
    };
    if ((prop == "textDirection") && ["auto", "ltr", "rtl"].includes(value.textDirection)) {
      this.textDirection = value.textDirection;
    };
    if (prop == "id") { this.id = value.id };
  };
  if (isUseless(this.id)) {
    console.error("There should be a unique URI provided as the id field of all bodies and targets in annotations");
    this.id = Math.random().toString().substring(2);
  };

};

Polyanno.annotation = function(value) {

  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };

  this["@context"] = [
    "http://www.w3.org/ns/anno.jsonld"
    ];
  if ((!isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = opts._id;
    this.id = opts.id;
  }
  else if ((!isUseless(opts._id)) && (isUseless(opts.id))) {
    this._id = opts._id;
    this.id = Polyanno.urls.annotation.concat(opts._id);
  }
  else if ((isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = this.id = opts.id;
  }
  else {
    var newNum = Math.random().toString().substring(2);
    this._id = newNum;
    this.id = Polyanno.urls.annotation.concat(newNum);
  };

  this.type = "Annotation";
  this.body = subdocIDchecking(opts.body);
  if (opts.target instanceof Array) {  this.target = settingTargets(opts.target, []);  }
  else {  console.error("TypeError: Annotation.target must be of Type Array.");  };
  this.creator = {
    name: polyanno_current_username,
    motivation: "identifying"
  };

  var self = this;
  PolyannoEventEmitter.call(self);

};


///

Object.defineProperty(Polyanno.annotation.prototype, "type", {
  set: function(value) {
    if (!value.includes("Annotation")) {
      console.error("Annotations must include 'Annotation' in their Type string.");
    }
    else {
      type = value;
    };
  }
});

var subdocIDchecking = function(value) {
    if ((value instanceof PAnnoSubDoc) && (!isUseless(value.id))) {
      return value;
    }
    else if (!isUseless(value.id)){
      return new PAnnoSubDoc(value);
    }
    else {
      console.error("Annotation bodies and targets should have IDs");
      return false;
    };
};

var settingTargets = function(value, oldArr) {
  var arr = [];
  for (var i=0; i < value.length; i++) {
    var this_target = subdocIDchecking(value[i]);
    if (this_target == false) { break; };
    var existing = findByID(oldArr, this_target.id);
    if (existing.length > 0) {
      for (props in this_target) {
        existing[0][props] = this_target[props];
      };
      arraySearchReplace(arr, existing);
    }
    else {
      arr.push(this_target);
    };
  };
  if (!isUseless(oldArr[0])) {    arr.concat(oldArr);  };
  return arr;
};


/////Methods

//singular

Polyanno.annotation.prototype.update = function(opts) {

  var ev1 = new PolyannoEvent({
    type: "polyanno_updating",
    object: this,
    timestamp: new Date()
  });
  this.trigger(ev1);

  for (var property in opts) {
    this[property] = opts[property];
  };
  
  var ev2 = new PolyannoEvent({
    type: "polyanno_updated",
    object: this,
    timestamp: new Date()
  });
  this.trigger(ev2);

  Polyanno.annotations.replaceOne(this);
};

Polyanno.annotation.prototype.delete = function() {

  var ev1 = new PolyannoEvent({
    type: "polyanno_deleting",
    object: this,
    timestamp: new Date()
  });
  this.trigger(ev1);

  var the_item = findByID(Polyanno.annotations.array, this.id)[0];
  Polyanno.annotations.array.splice(Polyanno.annotations.array.indexOf(the_item), 1);
  
  var ev2 = new PolyannoEvent({
    type: "polyanno_deleted",
    object: this,
    timestamp: new Date()
  });
  this.trigger(ev2);
};

Polyanno.annotation.prototype.getBody = function() {
  var id = this.body.id;
  return searchingUnknownByID(id);
};

Polyanno.annotation.prototype.getTargets = function() {
  var targets = this.target;
  var targetArr = [];
  for (var i=0; i < targets.length; i++) {
    var t = targets[i];
    targetArr.push(searchingUnknownByID(t.id));
  };
  return targetArr;
};

Polyanno.annotation.prototype.addTargets = function(targets) {
  var oldTargets = this.target;
  var newTargets = [];
  for (var i=0; i < targets.length; i++) {
    newTargets.push(targets[i]);
  };
  this.target = newTargets.concat(oldTargets);
};

////Events


///////

/////////////////// Annotations (plural)

Polyanno.annotations = new Polyanno.collections(Polyanno.annotation);

var expandingAnnotation = function (obj) {
  var bodyObj = searchingUnknownByID(obj.body.id);
  var targetArr = [];
  for (var i=0; i < obj.target.length; i++) {
    var t = obj.target[i];
    targetArr.push(searchingUnknownByID(t.id));
  };
  return {"anno": obj, "body": bodyObj, "target": targetArr};
};

Polyanno.getAnnotationsByTarget = function(target, type, expanded) {
  var search = function(targets, aim) {
    var a = $.grep(targets, function(t){
      return t.id == aim;
    });
    if (a.length > 0) {  return true;  }
    else { return false };
  };
  var types = function(items) {
    return $.grep(items, function (thing) {
      return thing.body.id.includes(Polyanno.urls[type])
    });
  };
  var arr = $.grep(Polyanno.annotations.array, function(anno){
    return search(anno.target, target);
  });

  var type_arr = function() {
    if (isUseless(type)) { return arr; }
    else {   return types(arr);  }
  };

  if (expanded) {
    var ta = type_arr(type);
    var newA = [];
    for (var n=0; n <ta.length; n++) {
      newA.push(expandingAnnotation(ta[n]));
    };
    return newA;
  }
  else {
    return type_arr(type);
  };
};

Polyanno.getAnnotationByBody = function(target, expanded) {
  var a = $.grep(Polyanno.annotations.array, function (anno) {
    return anno.body.id == target
  });
  if (expanded) {
    return expandingAnnotation(a[0]);
  }
  else {
    return a[0] ;
  };
};

///Events



////////////////////Base Annotations


Polyanno.baseAnnotationObject = function(value) {

  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };
  this["@context"] = [
    "http://www.w3.org/ns/anno.jsonld"
    ];

  this.type = opts.type;
  this.metadata = opts.metadata;
  this.format = opts.format;
  if (["auto", "ltr", "rtl"].includes(opts.textDirection)) {
    this.textDirection = opts.textDirection;
  };
  this.language = opts.language;
  this.processingLanguage = opts.processingLanguage;

  this.creator = {
    name: polyanno_current_username,
    motivation: "identifying"
  };

  var self = this;
  PolyannoEventEmitter.call(self);

};

Object.defineProperty(Polyanno.baseAnnotationObject.prototype, "format", {
  value: "application/json",
  writable: true,
  enumerable: true,
  configurable: false
});

/////Methods

Polyanno.baseAnnotationObject.prototype.isAnnotationBody = function() {
  var id = this.id;
  var theAnno = Polyanno.getAnnotationByBody(id);
  return theAnno;
};

Polyanno.baseAnnotationObject.prototype.isAnnotationTarget = function(type) {
  var id = this.id;
  var theAnnos = Polyanno.getAnnotationsByTarget(id, type, true);
  return theAnnos;
};

Polyanno.baseAnnotationObject.prototype.getAnnosTargetingThis = function(type) {
  var arr = this.isAnnotationTarget(type);
  var t=[];
  if (!isUseless(arr)) {
    for (var i=0; i < arr.length; i++) {
      t.push(arr[i].body);
    };
  };
  return t; 
};


//////////////////Base Texts

Polyanno.baseTextObject = function(value) {
  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };
  Polyanno.baseAnnotationObject.call(this, opts);
  this.text = opts.text;
  if (!isUseless(opts.vector)) { this.vector = opts.vector;  };
  if (!isUseless(opts.parent)) {  this.parent = opts.parent; }
  else {  this.parent = null; };
  this.voting = {
    up: 0,
    down: 0,
    rank: -1
  };
};


/////Methods

var siblingSearch = function(type, item) {
  var anno = Polyanno.getAnnotationByBody(item.id);
  var parentA = $.grep(anno.target, function(a){
    return a.id.includes(".html#"); 
  });
  if (parentA.length == 0) { return []; };
  var siblings = polyanno_annos_of_target(parentA[0].id, type);
  var f = siblings.sort(function(x, y){
    return x.voting.rank - y.voting.rank; //from lowest to highest numerically (0 to n) ranking
  });
  return f;
};

var updateSiblingsRanks = function(original_rank, vote, siblings, newRank, arr) {
  for (var i = original_rank - vote; ((vote > 0) && (i >= newRank)) || ((vote < 0) && (i <= newRank)); i -= vote) {
    //updating the other items rankings
    var thisID = siblings[i].id;
    var thisNeighbour = arr.getById(thisID);
    var newNeighbourRank = thisNeighbour.voting.rank + vote;
    thisNeighbour.voting.rank = newNeighbourRank;
  };
};

var setInitialRank = function(type, item) {
  ///those with more votes down could be ranked lower than those with no votes yet.
  var arr = Polyanno[type+"s"].array;
  if (isUseless(arr)) {  item.voting.rank = 0; } //if first of its kind at all then highest ranking
  else {
    var all = siblingSearch(type, item); //finds the this and other annos with the same parent ranked in order of rank
    all.splice(0, 1); //the new object will have a rank of -1 by default
    var lowVoted = $.grep(all, function(a){
      return (a.voting.up - a.voting.down) < 0 ; //finding the annos with lower rankings than no votes (zero)
    });
    if (all.length == 0) {  item.voting.rank = 0; } //if it is the first child then it is the highest ranking
    else if (lowVoted.length == 0) {
      item.voting.rank = all[all.length -1].voting.rank + 1; //if there are none worth less than zero then it is the lowest rank of them
    }
    else {
      item.voting.rank = lowVoted[0].voting.rank - 1; //if there are others worth less than zero votes than ranked one higher than them
      updateSiblingsRanks(all.length, 1, all, item.voting.rank, arr);
    };
  };
};

var voteChangeRank = function(type, item, vote) {
  var plural = type+"s";
  var arr = Polyanno[plural];
  ///vote = +1 or -1
  var siblings = siblingSearch(type, item); //in order of ranking
  var index = siblings.indexOf(item); //should be equal value to voting.rank property
  if ( ((index == 0) && (vote == 1)) || ((index == (siblings.length -1)) && (vote == -1)) ) { 
    //rank cannot get higher if already highest, and cannot get lower than lowest
    return false;
  }
  else {
    var newRank;
    var neighbour = index - vote;
    var diff = (siblings[neighbour].voting.up - siblings[neighbour].voting.down) - ( vote * (item.voting.up - item.voting.down));

    while ((diff < 0) && (neighbour > 0) && (neighbour < siblings.length - 1)) {
      //iterate through those with equal value to the next neighbour with a higher/lower
      neighbour -= vote;
      diff = (siblings[neighbour].voting.up - siblings[neighbour].voting.down) - ( vote * (item.voting.up - item.voting.down));
    };


    if ((neighbour == 0) && (diff < 0)) {
      ////if higher than top, then now top
      newRank = 0;

      ///////parent doc needs to be updated to include new top ranking text
      var theParent = arr.getById(item.parent);
      var parentAnno = Polyanno.getAnnotationByBody(item.id);
      var parentTarget = $.grep(parentAnno.target, function(a){
        return a.id.includes(".html#"); 
      });
      var spanID = parentTarget[0].id.split(".html")[1];
      var oldParentText = theParent.text;
      var t = $("<p>"+oldParentText+"</p>").find(spanID).html(item.text).parent();
      var newParentText = t.html();
      theParent.update({ text: newParentText });

      ///////if the parent is open in editors then reload with new texts 
      ///for all new editors opening the information should be okay, this is just for those already open
      var parentEds = Polyanno.editors.findAllByDoc(item.parent, plural);
      for (var a=0; a<parentEds.length; a++) {
        var parentEdDocs = parentEds[a].docs[plural];
        var theParentArray = $.grep(parentEdDocs, function(par){
          return par.id == item.parent;
        });
        var theOldParentIndex = parentEdDocs.indexOf(theParentArray[0]);
        parentEdDocs.splice(theOldParentIndex, 1, theParent);

        var parentEdIdString = "#" + parentEds[a].id;
        $(parentEdIdString).find(".polyanno-top-voted").html(" ");
        $(parentEdIdString).find(".polyanno-list-alternatives-row").html(" ");
        polyanno_display_editor_texts(parentEdDocs, parentEdIdString);
      };

    }
    else if ((neighbour == siblings.length -1) && (diff < 0)) {
      //if lower than bottom, then now top
      newRank = siblings.length -1;
    }
    else if (diff < 0) {
      //if it overtakes neighbour then takes its rank
      newRank = siblings[neighbour].voting.rank;
    }
    else {
      //if it only matches the neighbour then it is the rank one below
      newRank = siblings[neighbour].voting.rank + vote;
    };

    updateSiblingsRanks(item.voting.rank, vote, siblings, newRank, arr);

    item.voting.rank = newRank;

    return true;
  };
};



var votingFunction = function(vote, votedID, thisEditor) {
  var type = thisEditor.type;
  var plural = type.concat("s");
  var targetID = Polyanno.urls[type].concat(votedID); ///API URL of the annotation voted on

  var thisText = Polyanno[plural].getById(targetID);

  var votedTextBody = $("#"+votedID).html(); 

  thisText.voting[vote] = thisText.voting[vote] + 1;
  var rankHasChanged = voteChangeRank(type, thisText, +1);

  if (rankHasChanged) {

    var oldDocs = Polyanno.selected.getAll();

    //update the Polyanno.selected and refresh the editor
    oldDocs[plural] = siblingSearch(type, thisText);
    Polyanno.selected.setSelected(oldDocs);
    thisEditor.refresh();

  }
  else {
    //just update voting badge
    $("#"+thisEditor.id).find("#"+thisText._id).next().find(".badge").html(thisText.voting[vote]);
  };

};

var polyanno_find_highest_ranking_frag_child = function(location_json) {
  var the_child = fieldMatching(location_json.fragments, "voting.rank", 0); 
  return findField(the_child, "id");
};

var findHighestRankingChild = function(the_parent_json_children, locationID) {
  var theLocation = fieldMatching(the_parent_json_children, "id", locationID);
  return polyanno_find_highest_ranking_frag_child(theLocation);
};





//////////////////Transcriptions

Polyanno.transcription = function(value) {
  Polyanno.baseTextObject.call(this, value);
  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };
  if (!isUseless(opts.translation)) {  this.translation = opts.translation; };

  if ((!isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = opts._id;
    this.id = opts.id;
  }
  else if ((!isUseless(opts._id)) && (isUseless(opts.id))) {
    this._id = opts._id;
    this.id = Polyanno.urls.transcription.concat(opts._id);
  }
  else if ((isUseless(opts._id)) && (!isUseless(opts.id))) {
    this.id = opts.id;
    var index = opts.id.indexOf(Polyanno.urls.transcription);
    this._id = opts.id.split(index)[0];
  }
  else {
    var newNum = Math.random().toString().substring(2);
    this._id = newNum;
    this.id = Polyanno.urls.transcription.concat(newNum);
  };

};


/////Methods


//singular

Polyanno.transcription.prototype.update = function(opts) {

  var ev1 = new PolyannoEvent({
    type: "polyanno_updating",
    object: this,
    timestamp: new Date()
  });
  this.trigger(ev1);

  for (var property in opts) {
    this[property] = opts[property];
  };

  Polyanno.transcriptions.replaceOne(this);

  var ev2 = new PolyannoEvent({
    type: "polyanno_updated",
    object: this,
    timestamp: new Date()
  });
  this.trigger(ev2);
};

Polyanno.transcription.prototype.delete = function() {
  var the_item = findByID(Polyanno.transcriptions, this.id)[0];

  var ev1 = new PolyannoEvent({
    type: "polyanno_deleting",
    object: the_item,
    timestamp: new Date()
  });
  this.trigger(ev1);

  Polyanno.transcriptions.splice(Polyanno.transcriptions.indexOf(the_item), 1);

  var ev2 = new PolyannoEvent({
    type: "polyanno_deleted",
    object: the_item,
    timestamp: new Date()
  });
  this.trigger(ev2);
};


//////////Transcriptions (Plural)

Polyanno.transcriptions = new Polyanno.collections(Polyanno.transcription);


//////////////////Translations

Polyanno.translation = function(value) {
  Polyanno.baseTextObject.call(this, value);
  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };
  if (!isUseless(opts.transcription)) {  this.transcription = opts.transcription; };

  if ((!isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = opts._id;
    this.id = opts.id;
  }
  else if ((!isUseless(opts._id)) && (isUseless(opts.id))) {
    this._id = opts._id;
    this.id = Polyanno.urls.translation.concat(opts._id);
  }
  else if ((isUseless(opts._id)) && (!isUseless(opts.id))) {
    this.id = opts.id;
    var index = opts.id.indexOf(Polyanno.urls.translation);
    this._id = opts.id.split(index)[0];
  }
  else {
    var newNum = Math.random().toString().substring(2);
    this._id = newNum;
    this.id = Polyanno.urls.translation.concat(newNum);
  };

};

/////Methods



////Translations (plural)

Polyanno.translations = new Polyanno.collections(Polyanno.translation);


///////////////////Vectors


Polyanno.vector = function(value) {

  var opts = {};
  for (var prop in value) {
    opts[prop] = value[prop];
  };

  Polyanno.baseAnnotationObject.call(this, opts);

  this.notFeature = {
    notType: "Feature",
    notGeometry: {
      notType: "Polygon",
    },
    notCrs: {
      notType: "name",
      notProperties: "L.CRS.Simple"
    }
  };

  this.coordinates =  opts.geometry.coordinates[0];
  this.OCD = opts.OCD;
  this.parent = opts.parent;
  this.transcription_fragment = opts.transcription_fragment;
  this.translation_fragment = opts.translation_fragment;

  if ((!isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = opts._id;
    this.id = opts.id;
  }
  else if ((!isUseless(opts._id)) && (isUseless(opts.id))) {
    this._id = opts._id;
    this.id = Polyanno.urls.vector.concat(opts._id);
  }
  else if ((isUseless(opts._id)) && (!isUseless(opts.id))) {
    this._id = this.id = opts.id;
  }
  else {
    var newNum = Math.random().toString().substring(2);
    this._id = newNum;
    this.id = Polyanno.urls.vector.concat(newNum);
  };

};

Object.defineProperty(Polyanno.vector, "layer", {
  get: function() { return Polyanno.L.vectors.getLayer(this.id); }
});

Object.defineProperty(Polyanno.vector, "coordinates", {
  get: function() { return this.notFeature.notGeometry.notCoordinates; },
  set: function(value) {
    var new_coords = [];
    for (vari=0; i < value.length; i++) {
      coordinatesPair = value[i];
      var coordsNumbers = [];
      coordsNumbers.push(Number(coordinatesPair[0]));
      coordsNumbers.push(Number(coordinatesPair[1]));
      new_coords.push(coordsNumbers);
    };
    this.notFeature.notGeometry.notCoordinates = new_coords;
  }
})

/////Methods


//singular

Polyanno.vector.prototype.update = function(opts) {
  for (var property in opts) {
    this[property] = opts[property];
  };
  Polyanno.vectors.replaceOne(this);
};

Polyanno.vector.prototype.delete = function() {
  var the_item = findByID(Polyanno.vectors, this.id)[0];
  Polyanno.vectors.splice(Polyanno.vectors.indexOf(the_item), 1);
};


////////

Polyanno.vectors = new Polyanno.collections(Polyanno.vector);

///////////////////Image



/////Methods

//load the existing vectors
var polyanno_load_existing_vectors = function(existingVectors) {

  var tempGeoJSON = {  "type": "Feature",  "properties":{},  "geometry":{}  };
  var currentVectorLayers = {};

  ///need to make sure that the layers load in the correct order so that the children are always on top of their parents

  if (!isUseless(existingVectors) && !isUseless(existingVectors[0])) {
    existingVectors.forEach(function(vector) {

      var oldData = tempGeoJSON;
      oldData.geometry.type = vector.notFeature.notGeometry.notType;
      oldData.geometry.coordinates = [vector.notFeature.notGeometry.notCoordinates];
      oldData.properties.transcription_fragment = findField(vector, "transcription_fragment");
      oldData.properties.translation_fragment = findField(vector, "translation_fragment");
      oldData.properties.parent = findField(vector, "parent");
      oldData.properties.children = findField(vector, "children");
      oldData.properties.OCD = findField(vector, "OCD");

      var existingVectorFeature = L.geoJson(oldData, 
        { style: {
            color: Polyanno.colours.default.vector
          },
          onEachFeature: function (feature, layer) {
            layer._leaflet_id = vector.id,
            Polyanno.L.vectors.addLayer(layer),
            layer.bindPopup(Polyanno.L.menu.newVector)
          }
        }).addTo(Polyanno.L.map);

    });
  };
};

var polyanno_new_vector_made = function(layer, shape, vector_parent, vector_children, callback_function, fromMerge) {
  var annoData = {geometry: shape.geometry, metadata: imageSelectedMetadata, parent: vector_parent, children: vector_children };

  if (!isUseless(shape.properties)&&(!isUseless(shape.properties.OCD))) {  annoData.OCD = shape.properties.OCD;  };

  if (Polyanno.connectingEquals.status) { 
    var theTopText = findHighestRankingChild(Polyanno.connectingEquals.parent_anno, Polyanno.selected.transcription.DOMid);
    annoData[Polyanno.connectingEquals.type] = theTopText;  
  }
  else if (fromMerge){
    annoData.transcription = shape.properties.transcription;
    annoData.translation = shape.properties.translation;
  }
  else {
    ///not sure entirely about synchronicity of this but meh
    Polyanno.selected.reset();
  };

  var targetData = {target: [], body: {}};
  var IIIFsection = Polyanno.image.getIIIFURL(imageSelected, shape.geometry.coordinates[0], "jpg");
  targetData.target.push({
      "id": imageSelected,
      "format": "application/json"
  });
  targetData.target.push({
      "id": IIIFsection,
      "format": "image/jpg" 
  });

  //Objects

  var data = new Polyanno.vector(annoData);
  Polyanno.vectors.add(data);
  if (Polyanno.vectors.array.length == 2) { $("#polyanno-merge-shapes-enable").removeClass("disabled").prop('disabled', false); };

  targetData.body = data;
  var new_anno = new Polyanno.annotation(targetData);
  Polyanno.annotations.add(new_anno);

  Polyanno.selected.vectors.add(data);
  Polyanno.selected.targets = targetData.target.concat([{"id": data.id, "format": "image/SVG"}]);

  //Leaflet

  layer._leaflet_id = data.id;

  if (!Polyanno.connectingEquals.status) { layer.bindPopup(Polyanno.L.menu.newVector).openPopup(); }
  else {  updateVectorSelection(data); };

  if (!isUseless(callback_function)) {  callback_function(data);  };


};










///////////////////Selected


Polyanno.selected = {
  vectors: new Polyanno.collections(Polyanno.vector),
  transcriptions: new Polyanno.collections(Polyanno.transcription),
  translations: new Polyanno.collections(Polyanno.translation),
  targets: new Polyanno.collections(Object)
};

Object.defineProperty(Polyanno.selected, "vector", {
  get: function() { return Polyanno.selected.vectors[0] },
  set: function(value) {
    if (value instanceof Polyanno.vector) {  Polyanno.selected.vectors[0] = value;  }
    else {  Polyanno.selected.vectors[0] = new Polyanno.vector(value);  };
  }
});

Object.defineProperty(Polyanno.selected, "transcription", {
  get: function() { return Polyanno.selected.transcriptions[0] },
  set: function(value) {
    if (value instanceof Polyanno.transcription) {  Polyanno.selected.transcriptions[0] = value;     }
    else { Polyanno.selected.transcriptions[0] = new Polyanno.transcription(value); };
  }
});
Object.defineProperty(Polyanno.selected, "translation", {
  get: function() { return Polyanno.selected.translations[0] },
  set: function(value) {
    if (value instanceof Polyanno.translation) {  Polyanno.selected.translations[0] = value;     }
    else { Polyanno.selected.translations[0] = new Polyanno.translation(value); };
  }
});


///Methods

Polyanno.selected.getAll = function() {
  return {
    vectors: Polyanno.selected.vectors.getAll(),
    transcriptions: Polyanno.selected.transcriptions.getAll(),
    translations: Polyanno.selected.translations.getAll(),
    targets: Polyanno.selected.targets.array,
  };
};

Polyanno.selected.reset = function () {
  Polyanno.selected.vectors.deleteAll();
  Polyanno.selected.transcriptions.deleteAll();
  Polyanno.selected.translations.deleteAll();
  Polyanno.selected.targets.array = [];
};

Polyanno.selected.setSelected = function (docs) {
  Polyanno.selected.reset();
  for (var property in docs) {
    Polyanno.selected[property].array = docs[property];
  };
};

Polyanno.selected.setVector = function (vec) {
  Polyanno.selected.vectors.add(Polyanno.vectors.getById(vec.layer._leaflet_id));
  var transcriptions_ids = polyanno_annos_of_target(vec.layer._leaflet_id, "transcription");
  var translations_ids = polyanno_annos_of_target(vec.layer._leaflet_id, "translation");
  if (transcriptions_ids.length != 0) { Polyanno.selected.transcriptions.add(transcriptions_ids[0]);  };
  if (translations_ids.length != 0) { Polyanno.selected.translations.add(translations_ids[0]); };
  if((!isUseless(vec.layer.properties)) && (!isUseless(vec.layer.properties.parent))){
    Polyanno.selected.vector.parent = vec.layer.properties.parent;
  };
};















///////////////////connectingEquals

Polyanno.connectingEquals = {};
Polyanno.connectingEquals.status = false; //used to indicate if the user is currently searching for a vector to link or not
/*
{     siblings: Polyanno.selected.transcriptions,
      parent_anno : Polyanno.selected.transcriptions[0].parent,
      parent_vector : checkForVectorTarget(parent_anno)
}*/

///*****
//document.getElementById("polyanno-toplayer-range").oninput = function(){
  ///update the largest text granularity visible
  //value of 1 == smallest granularity
//};

var polyanno_linking_annos_to_vector_checks = function(layer) {

  var shape = layer.toGeoJSON();

  //[number, overlap_array, parent_array, children_array]
  var checkingOverlapping = check_this_shape_for_overlapping(shape, Polyanno.L.vectors, false, true, false); //don't complete children array, do complete parent array

  if ((checkingOverlapping[0] == 2) && (checkingOverlapping[2].includes(Polyanno.connectingEquals.parent_vector))) {  ///inside the correct vector
    Polyanno.L.vectors.addLayer(layer);

    $("#polyanno-toplayer-range").css("display", "inline-block"); /////****
    var newLayNo = $("#polyanno-toplayer-range").attr("max") + 1;
    $("#polyanno-toplayer-range").attr("max", newLayNo);
    $("#polyanno-toplayer-range").attr("value", newLayNo);

    layer.bindPopup(Polyanno.HTML.popups.connectingEquals).openPopup();
  }
  else { 
    Polyanno.L.vectors.removeLayer(layer);
    var popLtLngs = Polyanno.connectingEquals.parent_vector.getBounds().getCenter(); 
    Polyanno.L.map.fitBounds(Polyanno.connectingEquals.parent_vector.toGeoJSON().geometry.coordinates[0]);
  };
};

var updateVectorSelection = function(the_vector_url) {

  var textData = {target: [{id: the_vector_url, format: "image/SVG"}]};
  Polyanno.connectingEquals.siblings.forEach(function(child){
    updateAnno(child[0].body.id, textData);
  });

  //Polyanno.connectingEquals.editor;
  //$().find(".polyanno-vector-link-row").css("display", "none");

  ///update Polyanno.editors to activate highlighting

  polyanno_connecting_equals_disabled();

};

var polyanno_setting_selecting_vector = function() {
  var this_layer = Polyanno.L.vectors.getLayer(Polyanno.selected.vector.id);
  var this_shape = this_layer.toGeoJSON();
  var this_parent = Polyanno.connectingEquals.parent_vector._leaflet_id;
  polyanno_new_vector_made(this_layer, this_shape, this_parent);
};
var polyanno_reset_selecting_vector = function() {
  var this_layer = Polyanno.L.vectors.getLayer(Polyanno.selected.vector.id);
  Polyanno.L.vectors.removeLayer(this_layer);
};

//states

var polyanno_connecting_equals_enabled = function() {

  Polyanno.connectingEquals.status = true;  
  var vec = Polyanno.connectingEquals.parent_vector;

  ///disabled unnecessary functionailty
  Polyanno.L.drawControl.default.remove();
  polyanno_disable_keyboards();
  $("#polyanno-merge-shapes-enable").addClass("disabled").prop('disabled', true);

  //Leaflet
  Polyanno.L.drawControl.connectingEquals.addTo(Polyanno.L.map);
  var b = vec.getBounds();
  Polyanno.L.map.fitBounds(b);
  Polyanno.L.map.setMaxBounds(b);
  vec.unbindPopup();
  L.drawLocal.draw.handlers.polygon.tooltip.start = 'Draw around the text on the image';
  L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Draw around the text on the image';

};

var polyanno_connecting_equals_disabled = function() {

  Polyanno.connectingEquals.status = false;
  var vec = Polyanno.connectingEquals.parent_vector;

  //restore functionality
  Polyanno.L.drawControl.connectingEquals.remove();
  polyanno_enable_keyboards();
  $("#polyanno-merge-shapes-enable").removeClass("disabled").prop('disabled', false);

  //leaflet
  Polyanno.L.drawControl.default.addTo(Polyanno.L.map);
  Polyanno.L.map.setMaxBounds(null);
  var vec = Polyanno.L.vectors.getLayer(Polyanno.connectingEquals.vector.id);
  vec.bindPopup(Polyanno.L.menu.newVector);
  L.drawLocal.draw.handlers.polygon.tooltip.start = 'Draw around the text on the image';
  L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Draw around the text on the image';
};






//editing

Polyanno.selected.currentlyEditing = false;
Polyanno.selected.currentlyDeleting = false;












///////////////////Editors

Polyanno.editor = function(textType) {

  var popupIDstring = createEditorPopupBox(textType);
  var plural = textType.concat("s");

  this.DOM = $(popupIDstring);
  this.id = $(popupIDstring).attr("id");

  this.docs = {
    vectors: Polyanno.selected.vectors.array,
    transcriptions: Polyanno.selected.transcriptions.array,
    translations: Polyanno.selected.translations.array
  };
  this.targets = Polyanno.selected.targets;
  this.type = textType;

  var thisEditor = this;

  updateEditorBox(popupIDstring, plural);

};

Polyanno.editors = new Polyanno.collections(Polyanno.editor);

/////Methods

Polyanno.editor.prototype.update = function(opts) {
  var dom = this.DOM;
  for (var property in opts) {
    this[property] = opts[property];
  };
  Polyanno.editors.replaceOne(this);
};

Polyanno.editor.prototype.closeEditor = function() {
  var thisEditor = this;
  var id = this.id;
  var the_editor_gone = dragondrop_remove_pop(id);
  Polyanno.colours.connectColours(thisEditor, "editor", "default");
  Polyanno.editors.removeEditor(id);

  return the_editor_gone;
};

Polyanno.editor.prototype.refresh = function() {
  //refreshing UI box
  var thisType = this.type;
  var plural = thisType + "s";
  var popupIDstring = "#" + this.id;
  $(popupIDstring).find(".polyanno-top-voted").html(" ");
  $(popupIDstring).find(".polyanno-list-alternatives-row").html(" ");
  updateEditorBox(popupIDstring, plural);

  //refreshing docs
  this.docs = {
    vectors: Polyanno.selected.vectors.array,
    transcriptions: Polyanno.selected.transcriptions.array,
    translations: Polyanno.selected.translations.array
  };
  this.targets = Polyanno.selected.targets;

};

Polyanno.editor.prototype.setSelected = function() {

  Polyanno.selected.reset();

  Polyanno.selected.vectors.array = this.docs.vectors;
  Polyanno.selected.transcriptions.array = this.docs.transcriptions;
  Polyanno.selected.translations.array = this.docs.translations;

  Polyanno.selected.targets = this.targets;

};

Polyanno.editor.prototype.checkDocs = function(docID, type) {
  var arr = this.docs[type];
  var check = $.grep( arr, function(doc) {
      return doc.id == docID;
    });
  if (check.length == 0) { return false; }
  else { return true; };
};


//plural

Polyanno.editors.removeEditor = function(id) {
  var this_editor = findByID(Polyanno.editors.array, id)[0];
  Polyanno.editors.array.splice(Polyanno.editors.array.indexOf(this_editor), 1);
};

Polyanno.editors.closeAll = function() {
  for (var i=0; i < Polyanno.editors.array.length; i++) {
    var item = Polyanno.editors.array[i];
    item.closeEditor();
  };
};

Polyanno.editors.openEditor = function(textType) {

  var ed = new Polyanno.editor(textType);
  Polyanno.editors.add(ed);

  return ed;

};

Polyanno.editors.ifOpen = function(fromType) {

  var comparison = Polyanno.selected.getAll();
  if (isUseless(Polyanno.editors.array[0])) {    Polyanno.editors.openEditor(fromType);  }
  else {
    var opened = $.grep( Polyanno.editors.array, function(ed) {
      return ed.docs == comparison;
    });
    if (opened.length == 0) {
      Polyanno.editors.openEditor(fromType);
    }
    else {
      $(opened[0].id).effect("shake");
    };
  };
};

Polyanno.editors.findAllByDoc = function(docID, type) {
  return $.grep( Polyanno.editors.array, function(ed) {
      return ed.checkDocs(docID, type);
  });
};

Polyanno.editors.findOneByDoc = function(docID, type) {
  var arr = $.grep( Polyanno.editors.array, function(ed) {
      return ed.checkDocs(docID, type);
  });
  return arr[0];
};





///// VIEWER WINDOWS

var polyanno_shake_the_popups = function() {
  var n = $("#polyanno-page-body").length;
  for (var i=1; i < n; i++) {
    $(".annoPopup").get(i)
    .effect("shake", {
      direction: "right",
      distance: 10,
      times: 2
    });
  };
};

var preBtnClosing = function(thisEditorID) {
  $("#"+thisEditorID).hide("explode", null, 400, polyanno_shake_the_popups);
  var thisEditor = Polyanno.editors.getById(thisEditorID);
  Polyanno.colours.connectColours(thisEditor, "editor", "default");
  Polyanno.editors.removeEditor(thisEditorID);
};

var createEditorPopupBox = function(textType) {

  var dragon_opts = {
    "minimise": polyanno_minimising,
    "initialise_min_bar": false,
    "beforeclose": preBtnClosing
  };
  var polyannoEditorHTML = polyannoEditorHTML_partone + polyannoEditorHTML_options + polyannoEditorHTML_partfinal;
  var popupIDstring = add_dragondrop_pop("textEditorPopup", polyannoEditorHTML, "polyanno-page-body", dragon_opts, polyannoEditorHandlebarHTML);
  $(popupIDstring).hide().show("drop", null, 200, polyanno_shake_the_popups);
  $(popupIDstring).find(".dragondrop-handlebar").addClass("polyanno-colour-change");
  $(popupIDstring).find(".dragondrop-handlebar-obj").addClass("polyanno-colour-change");
  $(popupIDstring).find(".dragondropbox").addClass("textEditorBox");
  $(popupIDstring).find(".dragondrop-title").html(returnTextIcon(textType));
  $(popupIDstring).find(".textEditorMainBox").find('*').addClass(textType+"-text");

  ////temporary until dragondrop is fixed
  $(popupIDstring).on("click", ".dragondrop-close-pop-btn", function(){
    var thisPopID = $(popupIDstring).attr("id");
    preBtnClosing(thisPopID);
  });

  return popupIDstring;

};

var updateEditorBox = function(popupIDstring, plural) {
  if (Polyanno.selected.vectors.array.length == 0) {  
    $(popupIDstring).find(".polyanno-vector-link-row").css("display", "block");
  };

  if (Polyanno.selected[plural].array.length == 0) {
    $(popupIDstring).find(".polyanno-add-new-row")
    .css("display", "block")
    .attr("id", "addBox"+popupIDstring);
    if ($(".polyanno-language-buttons").css("display") == "none") {
      $(".polyanno-language-buttons").css("display", "inline-block");
    };
  }
  else {
    var mainText = Polyanno.selected[plural].array[0];
    if (!isUseless(mainText.parent)) {
      $(popupIDstring).find(".polyanno-add-new-toggle-row").css("display", "block");
    };

    polyanno_display_editor_texts(Polyanno.selected[plural].array, popupIDstring);

  }; 
};

var returnTextIcon = function(textType){
  if(textType == "transcription") {
    return transcriptionIconHTML;
  }
  else if (textType == "translation"){
    return translationIconHTML;
  };
};

var polyanno_build_text_display_row = function(polyannoTextAnno) {
  var paragraphHTML = " <p id='";
  var middleHTML = "' class='content-area' title=' '>";
  var closingHTML1 = "</p>"
  var itemText = polyannoTextAnno.text;
  var itemID = polyannoTextAnno._id;
  var itemHTML = paragraphHTML + itemID + middleHTML + itemText + closingHTML1 + polyannoVotingRow1 + polyannoTextAnno.voting.up + polyannoVotingRow2; ///////********voting
  return itemHTML;
};

var polyanno_build_alternatives_list = function(existingTextAnnos, popupIDstring) {

  $(popupIDstring).find(".polyanno-alternatives-toggle-row").css("display", "block");

  existingTextAnnos.forEach(function(subarray, index) {

    var theParagraphHTML = polyanno_build_text_display_row(subarray);
    var thisItemID = subarray._id;
    var thisItemURL = subarray.id;

    if (index == 0){
      $(popupIDstring).find(".polyanno-top-voted").append(theParagraphHTML);
    }
    else {
      $(popupIDstring).find(".polyanno-list-alternatives-row").append(theParagraphHTML);
    };

    if ( !isUseless(subarray[1]) )  {
      var votesUp = subarray[1].votesUp;
      $("."+thisItemID).next().find(".badge").html(votesUp); 
    }; 
 
  });
};

var polyanno_display_editor_texts = function(existingTextAnnos, popupIDstring) {

  $(popupIDstring).find(".polyanno-top-voted").css("display", "block");

  if (existingTextAnnos.length == 1) {
    var itemHTML = polyanno_build_text_display_row(existingTextAnnos[0]);
    $(popupIDstring).find(".polyanno-top-voted").append(itemHTML);
  }
  else {
    polyanno_build_alternatives_list(existingTextAnnos, popupIDstring);
  };

};

var polyanno_populate_tags = function(theAnno, popupIDstring) {
  var tagHTML1 = "<a class='polyanno-tag' >";
  var tagHTML2 = "</a>";
  if (!isUseless(theAnno.metadata)) {
    var polyanno_searching = $.grep(theAnno.metadata, function(e){ 
        if (!isUseless(e.label)) {  return e.label == "Tag";   };
    });
    polyanno_searching.forEach(function(theTagSpan){
      var polyannoTagHTML = tagHTML1 + theTagSpan + tagHTML2;
      $(popupIDstring).find(".polyanno-metadata-tags-row").append(polyannoTagHTML);
    });
  };
};

//////////////////////////////////////////////////////////////////

///// TEXT SELECTION

Polyanno.textHighlighting = {
  selected: null,
  parentDOM: null,
  DOM: null,
  oldContent: null,
  newContent: null,
  DOMid: null,
  URI: null,
  fragment: null
};

Polyanno.textHighlighting.getSelected = function() {
  if(window.getSelection) { return window.getSelection(); }
  else if(document.getSelection) { return document.getSelection(); }
  else {
    var selection = document.selection && document.selection.createRange();
    if(selection.text) { return selection.text; }
    return false;
  }
};

Polyanno.textHighlighting.findSpanClass = function(startParentClass) {
  if (startParentClass.includes('transcription-text')) {
    return "transcription-text opentranscriptionChildrenPopup";
  }
  else if (startParentClass.includes('translation-text')) {
    return "translation-text opentranslationChildrenPopup";
  }
  else {
    return null;
  }
};

Polyanno.textHighlighting.strangeTrimmingFunction = function(thetext) {
  var t = new String(thetext).replace(/^\s+|\s+$/g,'');
  if(thetext && t) {
    return thetext.toString();
  }; 
};

Polyanno.textHighlighting.menu = {};

Polyanno.textHighlighting.menu.newText = function(theDOM, base) {
  theDOM.popover({ 
    trigger: 'manual',
    html : true,
    container: 'body',
    placement: "auto top",
    title: closeButtonHTML,
    viewport: "#polyanno-page-body",
    content: Polyanno.HTML.popups.textHighlighting[base]
  });

  theDOM.popover('show');
  theDOM.on("shown.bs.popover", function(ev) {

    var thisID = theDOM.attr("id");

    $(document).on("mouseup", function(event) {
      /*if ( $(event.target).closest('.openTranscriptionMenuNew,.openTranslationMenuNew,.openTranscriptionMenuOld,.openTranslationMenuOld').length == 0 ) { //if anything that is not the buttons is selected then the menu closes
        alert("closing all");
        theDOM.popover("hide");
        if (!isUseless(Polyanno.textHighlighting.DOMid)) {
          Polyanno.textHighlighting.parentDOM.html(Polyanno.textHighlighting.oldContent); 
        };
      };*/
    });

    $('.openTranscriptionMenuNew').on("click", function(event) {
      theDOM.popover("hide");
      Polyanno.textHighlighting.new("transcription");   
    });

    $('.openTranslationMenuNew').on("click", function(event) {
      theDOM.popover("hide");
      Polyanno.textHighlighting.new("translation");  
    });

    $('.closePopoverMenuBtn').on("click", function(event){
      theDOM.popover("hide");
      if (!isUseless(Polyanno.textHighlighting.DOMid)) {
        Polyanno.textHighlighting.parentDOM.html(Polyanno.textHighlighting.oldContent); 
      };
    }); 

    $('.openTranscriptionMenuOld').on("click", function(event) {
      //alert(JSON.stringify(Polyanno.selected.getAll())); 
      theDOM.popover("hide");
      Polyanno.editors.ifOpen('transcription');
    });

    $('.openTranslationMenuOld').on("click", function(event) {
      //alert(JSON.stringify(Polyanno.selected.getAll())); 
      theDOM.popover("hide");
      Polyanno.editors.ifOpen('transcription');
    });

  });
};


Polyanno.textHighlighting.setOESC = function(outerElementHTML, previousSpanContent, previousSpan) {
  var outerElementStartContent;
  if (previousSpan == "null" || previousSpan == null) {outerElementStartContent = previousSpanContent}
  else {
    var previousSpanAll = previousSpan.outerHTML;
    var StartIndex = outerElementHTML.indexOf(previousSpanAll) + previousSpanAll.length;
    outerElementStartContent = outerElementHTML.slice(0, StartIndex).concat(previousSpanContent);
  };
  return outerElementStartContent;
};

Polyanno.textHighlighting.setOEEC = function(outerElementHTML, nextSpanContent, nextSpan) {
    var outerElementEndContent;
    if (nextSpan == "null" || nextSpan == null) {outerElementEndContent = nextSpanContent}
    else {
      var EndIndex = outerElementHTML.indexOf(nextSpan.outerHTML);
      outerElementEndContent = nextSpanContent.concat(outerElementHTML.substring(EndIndex));
    };
    return outerElementEndContent;
};

Polyanno.textHighlighting.extractProperties = function(selection, classCheck) {

  var startNode = selection.anchorNode; // the text type Node that the beginning of the selection was in

  var startNodeText = startNode.textContent; // the actual textual body of the startNode - removes all html element tags contained
  var startNodeTextEndIndex = startNodeText.toString().length;
  var startParentID = startNode.parentElement.id;
  var startParentClass = startNode.parentElement.parentElement.className;

  ////////***** Selections ends depend on which way aorund the text is selected NOT which way around in the text the positions are ******
  var nodeLocationStart = selection.anchorOffset; //index from within startNode text where selection starts
  var nodeLocationEnd = selection.focusOffset; //index from within endNode text where selection ends
  if (nodeLocationStart < nodeLocationEnd) {
    nodeLocationStart = selection.focusOffset;
    nodeLocationEnd = selection.anchorOffset;
  };

  var endNode = selection.focusNode; //the text type Node that end of the selection was in 

  var endNodeText = endNode.textContent;
  var endParentID = endNode.parentElement.id; //the ID of the element type Node that the text ends in

  var outerElementTextIDstring = "#" + startParentID; //will be encoded URI of API?
  Polyanno.textHighlighting.parentDOM = $(outerElementTextIDstring);

  var edID = $(outerElementTextIDstring).closest(".textEditorPopup").attr("id");
  var ed = Polyanno.editors.getById(edID);
  var base = ed.type;
  var plural = base.concat("s");

  Polyanno.textHighlighting.parent = ed.docs[plural][0].id;

  //if selection is already a child/button
  if (classCheck.includes('opentranscriptionChildrenPopup')) { 
    Polyanno.selected.reset();
    Polyanno.textHighlighting.type = "transcription";

    var thisSpanID = selection.anchorNode.parentElement.id;
    var targetID = Polyanno.textHighlighting.parent.concat(".html#"+thisSpanID);

    var t = polyanno_annos_of_target(targetID, "transcription");
    Polyanno.selected.transcriptions.array = t;
    Polyanno.selected.targets.array = [{id: targetID}];
    //alert("before the popover opens the selected is "+JSON.stringify(Polyanno.selected.getAll()));
    $(selection.anchorNode.parentElement).popover("show");
  }
  else if (classCheck.includes('opentranslationChildrenPopup')) { 
    Polyanno.selected.reset();
    Polyanno.textHighlighting.type = "translation";

    var thisSpanID = selection.anchorNode.parentElement.id;
    var targetID = Polyanno.textHighlighting.parent.concat(".html#"+thisSpanID);

    var t = polyanno_annos_of_target(targetID, "translation");
    Polyanno.selected.translations.array = t;
    Polyanno.selected.targets.array = [{id: targetID}];
    $(selection.anchorNode.parentElement).popover("show");
  }  

  //if trying to select an overlapping area  
  else if (startParentID != endParentID) {
  
  }
  else {

    var newNodeInsertID = Math.random().toString().substring(2);

    var newSpan = "<a class='" + Polyanno.textHighlighting.findSpanClass(startParentClass) + " ' id='" + newNodeInsertID + "' >" + selection + "</a>";
    var outerElementHTML = Polyanno.textHighlighting.parentDOM.html().toString(); 

    ///CONTENT BEFORE HIGHLIGHT IN THE TEXT TYPE NODE
    var previousSpanContent = startNodeText.slice(0, nodeLocationEnd); 
    /////this including to the end of the selected text???

    //CONTENT BEFORE HIGHLIGHT IN THE ELEMENT TYPE NODE
    var previousSpan = startNode.previousElementSibling; //returns null if none i.e. this text node is first node in element node
    var outerElementStartContent = Polyanno.textHighlighting.setOESC(outerElementHTML, previousSpanContent, previousSpan);

    ///CONTENT AFTER HIGHLIGHT IN THE TEXT TYPE NODE
    var nextSpanContent;
    ////this is starting before the start of the selected text???
    if (endNode == startNode) { nextSpanContent = startNodeText.slice(nodeLocationStart, startNodeTextEndIndex)}
    else {nextSpanContent = endNodeText.slice(0, nodeLocationStart)};

    ///CONTENT AFTER HIGHLIGHT IN ELEMENT TYPE NODE
    var nextSpan = endNode.nextElementSibling; //returns null if none i.e. this text node is the last in the element node
    var outerElementEndContent = Polyanno.textHighlighting.setOEEC(outerElementHTML, nextSpanContent, nextSpan );

    Polyanno.textHighlighting.DOMid = newNodeInsertID;
    Polyanno.textHighlighting.URI = Polyanno.textHighlighting.parent.concat(".html#"+Polyanno.textHighlighting.DOMid);
    Polyanno.textHighlighting.oldContent = Polyanno.textHighlighting.parentDOM.html();
    Polyanno.textHighlighting.newContent = outerElementStartContent + newSpan + outerElementEndContent;
    Polyanno.textHighlighting.fragment = Polyanno.textHighlighting.strangeTrimmingFunction(selection);

    Polyanno.textHighlighting.parentDOM.html(Polyanno.textHighlighting.newContent); 
    Polyanno.textHighlighting.DOM = $("#"+newNodeInsertID);

    Polyanno.textHighlighting.DOM.css("background-color", Polyanno.colours.processing.span);

    Polyanno.textHighlighting.menu.newText(Polyanno.textHighlighting.DOM, base);

  };
};


//////////////////////////////////////////////////////////////////

Polyanno.textHighlighting.reset = function() {
  Polyanno.textHighlighting.selected = null;
  Polyanno.textHighlighting.DOM = null;
  Polyanno.textHighlighting.parentDOM = null;
  Polyanno.textHighlighting.oldContent = null;
  Polyanno.textHighlighting.newContent = null;
  Polyanno.textHighlighting.DOMid = null;
  Polyanno.textHighlighting.fragment = null;
  Polyanno.textHighlighting.URI = null;
};

Polyanno.textHighlighting.new = function(base) {

  var plural = base.concat("s");

  ///objects
  var targetData = {
    text: Polyanno.textHighlighting.fragment, 
    metadata: imageSelectedMetadata, 
    parent: Polyanno.textHighlighting.parent,
    target: [
          {id: Polyanno.textHighlighting.URI, format: "text/html"}, 
          {id: Polyanno.textHighlighting.parent, format: "application/json"}, 
          {id: imageSelected,  format: "application/json"  } 
          ]
  };

  var data = new Polyanno[base](targetData);
  Polyanno[plural].add(data);

  targetData.body = data;
  var new_anno = new Polyanno.annotation(targetData);
  Polyanno.annotations.add(new_anno);

  var parent = Polyanno[plural].getById(Polyanno.textHighlighting.parent);
  parent.update({text: Polyanno.textHighlighting.newContent});

  setInitialRank(base, data);

  ///editors and selected

  Polyanno.selected.reset();
  Polyanno.selected[plural].add(data);
  Polyanno.selected.targets = targetData.target;

  var newEditor = Polyanno.editors.openEditor(base);

  var popover = Polyanno.textHighlighting.DOM.data('bs.popover');
  popover.options.content = Polyanno.HTML.popups.children[base];

  Polyanno.textHighlighting.reset();

};


$('#polyanno-page-body').on("mouseup", '.content-area', function(event) {

  var selection = Polyanno.textHighlighting.getSelected(); 
  var classCheck;
  if (!isUseless(selection) || !isUseless(selection.anchorNode.parentElement) ) {
    classCheck = selection.anchorNode.parentElement.className;
  };

  if ((classCheck.includes('openTranscriptionMenuOld'))||(classCheck.includes('openTranslationMenuOld')) ) { 
  //if it is a popover within the selection rather than the text itself



  }    
  else if (classCheck.includes('popover-title')) { 
    Polyanno.textHighlighting.parentDOM.popover('hide'); ///
  } 
  else if (classCheck.includes("polyanno-add-discuss")) {
    ////need to sort out Hypothesis code here
    if (Polyanno.textHighlighting.parentDOM.hasClass("annotator-hl")) {

    }
    else {
      var thisSpanText = Polyanno.textHighlighting.parentDOM.html().toString();
      new TextQuoteAnchor(Polyanno.textHighlighting.parentDOM, thisSpanText);
    };
  }
  else {
    Polyanno.textHighlighting.extractProperties(selection, classCheck);
  };
});








//////////////////////////////////////////////////////////////////

////TEXT SUBMISSION

Polyanno.selected.textBox = {};

Polyanno.selected.textBox.new = function(thisEditor){

  //Objects 

  var newText = thisEditor.DOM.find(".newAnnotation").val();
  var theData = {
    text: newText, 
    metadata: imageSelectedMetadata, 
    target: thisEditor.targets 
  };
  var type = thisEditor.type;
  var plural = type.concat("s");

  if (Polyanno.selected.vectors.array.length != 0) {  theData.vector =  Polyanno.selected.vectors.array[0].id; };
  if ( (!isUseless(thisEditor.docs[plural][0])) && (!isUseless(thisEditor.docs[plural][0].parent)) ) {   
    theData.parent = thisEditor.docs[plural][0].parent;  
  };

  var data = new Polyanno[type](theData);
  Polyanno[plural].add(data);

  theData.body = data;
  var new_anno = new Polyanno.annotation(theData);
  Polyanno.annotations.add(new_anno);

  setInitialRank(type, data);

  Polyanno.selected[plural].add(data);
  thisEditor.docs[plural] = Polyanno.selected[plural].array;

  ///HTML

  thisEditor.DOM.find(".polyanno-add-new-row").css("display", "none");
  var itemHTML = polyanno_build_text_display_row(data);
  if (thisEditor.DOM.find(".polyanno-top-voted").css("display") == "block") {
    thisEditor.DOM.find(".polyanno-alternatives-toggle-row").css("display", "block");
    thisEditor.DOM.find(".polyanno-list-alternatives-row").css("display", "block");
    thisEditor.DOM.find(".polyanno-list-alternatives-row").append(itemHTML);
  }
  else {
    thisEditor.DOM.find(".polyanno-top-voted").css("display", "block");
    thisEditor.DOM.find(".polyanno-top-voted").append(itemHTML);
  };

};


//////////////////////////////////////////////////////////////////












////GEOMETRY

/////find anticlockwise angle from edge one to edge two for each vertex in clockwise order
///between 0 and 360
var angle_from_zero = function(x,y) {
  var angle_radians = Math.atan2(y,x); //atan2 takes y first and deals with segments
  var angle_degrees = angle_radians * (180/Math.PI);
  if (y < 0) {
    return (360 + angle_degrees);
  }
  else {
    return angle_degrees;
  }
};

var recentre_coordinates = function(vertex_to_change, new_centre) {
  var new_x = vertex_to_change[0] - new_centre[0];
  var new_y = vertex_to_change[1] - new_centre[1];
  return [new_x, new_y];
};

var anticlockwise_vertex_angle = function(vertex1, vertex2) {
  //reset the centre to be the second vertex (the actual vertex in question)
  var new_vertex1 = recentre_coordinates(vertex1, vertex2);
  var anticlockwise_angle_v1 = angle_from_zero(new_vertex1[0],new_vertex1[1]);
  return anticlockwise_angle_v1;
};

//vertex = [x,y]
var anticlockwise_corner_angle = function(vertex1, vertex2, vertex3) {
  var anticlockwise_angle_v1 = anticlockwise_vertex_angle(vertex1, vertex2);
  var anticlockwise_angle_v3 = anticlockwise_vertex_angle(vertex3, vertex2);
  var angle = anticlockwise_angle_v3 - anticlockwise_angle_v1;
  if (angle < 0) { angle = 360 + angle; }

  var grad = (vertex2[1] - vertex1[1])/(vertex2[0] - vertex1[0]); //Math.tan(anticlockwise_angle_v1* Math.PI/180);
  var c = vertex1[1] - (vertex1[0] * grad);
  return [angle, anticlockwise_angle_v1, c];
};

var polyanno_find_shape_between = function(the_shape, point_a_index, point_b_index) {
  ///a is start of clockwise loop around shape, b is the end
  //need to account for the fact that the first and last coordinate have to be identical
  if (point_a_index == 0) { 
    return the_shape.slice(1, point_b_index); ///a is 0 AND last point, b is the penultimate point
  }
  else if (point_b_index == 0) {
    return the_shape.slice(2, (the_shape.length - 1)); //b is 0 AND last point, a is 1
  }
  else {
    var shape_start = the_shape.slice(1, point_b_index); // start not inlcuding ending, then up to, but not including, b
    var shape_end = the_shape.slice(point_a_index+1); // from (a + 1) to end
    return shape_end.concat(shape_start);
  }
};

var find_concavity_angles = function(coordinates) {
  /////if angle is between 180 degrees and 360 degrees then add it to the notches array
  ////need to account for repeat coordinates at beginning and end of array
  var notches_array = [];
  var line_equations = [];
  for (var i=0; i< (coordinates.length -1); i++) {
    var the_angle;
    var the_notch_i;
    var li;
    if (i == (coordinates.length - 2)) {
      var the = anticlockwise_corner_angle(coordinates[i],coordinates[0],coordinates[1]);
      the_angle = the[0];
      the_notch_i = 0;
      li = [the[1], the[2], the[0], coordinates[0], coordinates[i], coordinates[1], the_notch_i, -1];
    }
    else {
      var the = anticlockwise_corner_angle(coordinates[i],coordinates[i+1],coordinates[i+2]);
      the_angle = the[0];
      the_notch_i = i+1;
      li = [the[1], the[2], the[0], coordinates[i+1], coordinates[i], coordinates[i+2], the_notch_i, -1];
    };

    line_equations.push(li);

    if ((the_angle > 180) && (the_angle < 360)) {
      notches_array.push(li);
    };
  };
  return [notches_array, line_equations];
};

//Optimal Decomposition Algorithm

//x_patterns = line_equations
//steiner_points = points on internal line_equations




var find_linear_intersection = function(m1, c1, m2, c2, a_coords, b_coords) {
  ///m2 and c2 are infinity????
  var diffC = c2 - c1;
  var diffM = m1 - m2;

  ////these two are listed as NaN.....
  var intersect_x = diffC / diffM;
  var intersect_y = (m1 * intersect_x) + c1;
  //alert("so this line of y="+m1+"x + "+c1+" could intersect at \n["+intersect_x+","+intersect_y+"] and the two coords are "+JSON.stringify(a_coords)+" and "+JSON.stringify(b_coords)+"\nwith an equation of y="+m2+"x +"+c2);

  var a_x = a_coords[0];
  var a_y = a_coords[1];
  var b_x = b_coords[0];
  var b_y = b_coords[1];

  if (( ((a_x < b_x) && (a_x < intersect_x) && (intersect_x < b_x)) || ((a_x > b_x) && (b_x < intersect_x) && (intersect_x < a_x)) ) &&
  ( ((a_y < b_y) && (a_y < intersect_y) && (intersect_y < b_y)) || ((a_y > b_y) && (b_y < intersect_y) && (intersect_y < a_y)) )) 
  { 
    return [intersect_x, intersect_y];
  }
  else {
    return null;
  }
};

var find_P_intersection = function(eq, new_grad, new_c, prev_coords) {
  var a_coords = eq[4];
  var b_coords = eq[3];

  ///this_grad and eq[1] are currently infinity???
  var this_grad = (b_coords[1] - a_coords[1])/(b_coords[0] - a_coords[0]);
  var intersection = find_linear_intersection(new_grad, new_c, this_grad, eq[1], eq[4], eq[3]);
  return intersection;
};

var linear_equation_from_angle = function(angle, coordinates) {
  var new_grad = Math.tan(angle* Math.PI/180);
  var new_c = coordinates[1] - (new_grad * coordinates[0]);
  return [new_grad, new_c, angle];
};

var naive_ocd_vertex = function(equation, line_equations) {

  //equation = [incoming_line_angle, linear_eq_offset, angle_diff, coordinates, prev, next]
  var v_index = equation[3];
  var v_prev_index = equation[4];
  var v_next_index = equation[5];

  var new_angle_part1 = equation[2]/2; 
  var new_angle_part2 = equation[0];
  var new_angle = (new_angle_part1+new_angle_part2) % 360;

  var linear = linear_equation_from_angle(new_angle, v_index);
  var new_grad = linear[0];
  var new_c = linear[1];

  //alert("so for notch with incoming angle of "+equation[0]+" and diff of "+equation[2]+"\nthe split line has angle of "+new_angle+" and gradient of "+new_grad);

  for (var no=0; no < line_equations.length; no++) {
    var eq = line_equations[no];
    if ((eq[3] != v_index) && (eq[3] != v_next_index)) { 
      //alert("This eq1 is "+JSON.stringify(eq[1])+" and the a_coords are "+JSON.stringify(eq[4])+" with b_coords of "+JSON.stringify(eq[3]));
      var x_pattern_line = find_P_intersection(eq, new_grad, new_c, v_index);
      if (x_pattern_line != null) { 
        //x-pattern line equation ---> [angle, offset, angle_diff, coordinates, prev_coords, next_coords, index, degree]
        return [new_angle, new_c, null, x_pattern_line, v_prev_index, eq[3], null, 0];
      };
    };
  };
  return null;
};

var naive_ocd = function(equation, p_patterns, x_patterns) {
  var naive_X_check = naive_ocd_vertex(equation, x_patterns);
  if (naive_X_check == null) {
    var naive_P_check = naive_ocd_vertex(equation, p_patterns);
    x_patterns.push(naive_P_check);
  }
  else {
    //Steiner Points - vertices on the X Patterns
    x_patterns.push(naive_X_check);
  };
  return x_patterns;
};

var extended_range_wedge = function(v1) {
  //W = "extended ranges"
  var convex_diff = v1[2] - 180;
  var angle_min = (v1[0]+convex_diff) % 360;
  var angle_max = (v1[0]+v1[2]-convex_diff) % 360;

  var min = linear_equation_from_angle(angle_min, v[3]);
  var max = linear_equation_from_angle(angle_max, v[3]);

  return [min, max];
};

var extended_ranges_array = function(notches_array) {
  var a = [];
  for (var i=0; i <notches_array.length; i++) {
    var w = extended_range_wedge(notches_array[i]);
    a.push(w);
  };
  return a;
};

var x_patterns_hash_line = function(v_wedge, v, wedges, notches_array) {
  var nearby_notches = [];
  //wedges[i] = [min, max]
  //min = [m, c, angle]
  for (var i=0; i < wedges.length; i++) {
    if (wedges[i] != v_wedge) {
      var intersection1 = find_linear_intersection(v_wedge[0][0], v_wedge[0][1], wedges[i][0][0], wedges[i][0][1], v[3], notches_array[i][3]);
      var intersection2 = find_linear_intersection(v_wedge[1][0], v_wedge[1][1], wedges[i][0][0], wedges[i][0][1], v[3], notches_array[i][3]);
      var intersection3 = find_linear_intersection(v_wedge[0][0], v_wedge[0][1], wedges[i][1][0], wedges[i][1][1], v[3], notches_array[i][3]);
      var intersection4 = find_linear_intersection(v_wedge[1][0], v_wedge[1][1], wedges[i][1][0], wedges[i][1][1], v[3], notches_array[i][3]);
      //[incoming_line_angle, linear_eq_offset, angle_diff, coordinates, prev, next, index, degree]
      if (intersection1 != null) {  nearby_notches.push([intersection1, i]); };
      if (intersection2 != null) {  nearby_notches.push([v_wedge[1][2], v_wedge[1][1], null, intersection2, v[3], notches_array[i][3], i, 1]); };
      if (intersection3 != null) {  nearby_notches.push([v_wedge[0][2], v_wedge[0][1], null, intersection3, v[3], notches_array[i][3], i, 1]); };
      if (intersection4 != null) {  nearby_notches.push([v_wedge[1][2], v_wedge[1][1], null, intersection4, v[3], notches_array[i][3], i, 1]); };
    };
  };
  return nearby_notches;
};

var x_pattern_iteration = function(notches_array, wedges, hash_table, x_patterns) {};

var x_patterns_scan = function(notches_array) {
  //[min, max]
  var wedges = extended_ranges_array(notches_array);
  var hash_table = []; //new Array(wedges.length);
  var h = []; //new Array(wedges.length);

  for (var i=0; i < notches_array.length; i++) {
    var w = x_patterns_hash_line(wedges[i], notches_array[i], wedges, notches_array);
    //[[intersection, partner_index], ...]
    hash_table.push(w);
  };

  for (var n=0; n < notches_array.length; n++) {
    var wedge_info = hash_table[n];
    var x_pattern = [];
    if (wedge_info == null) {
      ///has already been linked together
    }
    else if (wedge_info.length == 0) {
      x_pattern = naive_ocd(v, p_patterns, x_patterns);
    }
    else if (wedge_info.length == 1) {
      var intersection = wedge_info[0][0];
      var partner_index = wedge_info[0][1];
      var partner = hash_table[partner_index];
      //[incoming_line_angle, linear_eq_offset, angle_diff, coordinates, prev, next, index, degree]
      x_pattern = [
        [wedges[n][0][2], wedges[n][0][1], null, intersection, notches_array[n][3], notches_array[partner_index][3], null, 1],
        [wedges[partner_index][0][2], wedges[partner_index][0][1], null, notches_array[partner_index][3], intersection, notches_array[partner_index][5], null, 1]
      ];
      
      for (var search=0; search < hash_table[partner_index].length; search++) {
        
      };
    }
    else if (wedge_info.length == 2) {
      ///

    }
    else {

    };
    h.push(x_pattern);
  };

  return hash_table;
};

var x_patterns_ocd = function(notches_array, p_patterns) {

  var OCD_array = [];

  var c = notches_array;
  var x_patterns = [];

  if (notches_array.length == 1) {
    x_patterns = naive_ocd(v, p_patterns, x_patterns);
  }
  else {
    for (var i=0; i < notches_array.length; i++) {
      //[incoming_line_angle, linear_eq_offset, angle_diff, coordinates, prev, next, index, degree]
      var v = c[i];

      ///connect nearest notches together??


      var naive_ocd_patterns = naive_ocd(v, p_patterns, x_patterns);

    };
  };

  //for handling layers externally -- change to x-patterns later???
  /*
  var no = 
  var this_geometry = polyanno_find_shape_between(coordinates, v[3], no);
  this_geometry.push([intersect_x, intersect_y]);
  this_geometry.splice(0,0, [intersect_x, intersect_y]);
  var this_id = Math.random().toString().substring(2);
  the_OCD_array.push({"_id": this_id, "coordinates": this_geometry});
  */

  //alert("the OCD is "+JSON.stringify(OCD_array));

  return OCD_array;
};

//if concave then apply optimal convex decomposition algorithm to vector and store corresponding convex geometry in arrays in notFeatures
var check_for_concavity = function(coordinates) {
  var the_circling = find_concavity_angles(coordinates);
  var the_notches_array = the_circling[0];
  if (the_notches_array.length > 0) {
    return x_patterns_ocd(the_notches_array, the_circling[1], [], []);
  }
  else {
    return false;
  };
};

/////properties: [
///// OCD: [
///////   { _id: unique_id,
///////     coordinates: []
///////   }
///// ], ....



















//////Point In Polygon

//anticlockwise between edges 1 and 2 is always the inside of the shape for all the convex polygons
//so 180 degrees clockwise of an edge is always the side of the edge overlapping inside the shape
//so if a vector axis is created along the edge then the perpendicular measurement taken from each vertex of the other shape to that axis
//if it is on the 180 degrees side interior to the shape then it is overlapping

//---> if there is at least one side for which the vertex has a positive y value then it is not overlapping

var rotate_axes_coordinates = function(vertex, rotating_vertex) {
  var axes_rotation_angle = Math.atan2(rotating_vertex[1],rotating_vertex[0]); //atan2 takes (y,x), deals with segments, and output in radians
  var old_v_angle = Math.atan2(vertex[1],vertex[0]); 
  var new_angle = old_v_angle - axes_rotation_angle;
  var the_radius = Math.sqrt((vertex[0]*vertex[0])+(vertex[1]*vertex[1]));
  var new_y = the_radius * (Math.sin(new_angle));
  return new_y;
};

var find_y_dash_value = function(vertex, first_point, second_point) {
  var new_vertex2 = recentre_coordinates(second_point, first_point);
  var new_test_vertex = recentre_coordinates(vertex, first_point);
  if (rotate_axes_coordinates(new_test_vertex, new_vertex2) >= 0) {
    return true;
  }
  else {
    return false;
  };
};

var check_if_overlapping = function(vertex, coordinates) {
  var is_y_positive = [];
  for (var i = 0; i < coordinates.length; i++) {
    if (i != (coordinates.length - 1)) {
      is_y_positive.push(find_y_dash_value(vertex, coordinates[i], coordinates[i+1]));
    };
  };
  return !(is_y_positive.includes(true));
};

var check_inside_another_shape = function(new_shape, old_shape) {
  var overlapping_coords = [];
  for (var a=0; a < new_shape.length; a++) {
    var this_vertex = new_shape[a];
    var is_overlapping = check_if_overlapping(this_vertex, old_shape);
    if (is_overlapping) {  overlapping_coords.push(this_vertex);  };
  };
  return overlapping_coords;
};

var check_this_shape_inside = function(new_shape, old_shape) {

  var overlapping_coords = check_inside_another_shape(new_shape, old_shape);

  if (overlapping_coords.length == new_shape.length) {
    return 2; //new shape is entirely inside old one
  }
  else if (overlapping_coords.length > 0) {
    return 1; //new shape overlaps with old one
  }
  else {
    return 0; //no overlap
  };
};

var check_this_geoJSON = function(shape, drawnItem, justOverlap) {
  var new_shape_coordinates = shape.geometry.coordinates[0];
  var old_shape_coordinates = drawnItem.geometry.coordinates[0];

  if ((!isUseless(drawnItem.properties))&&(!isUseless(drawnItem.properties.OCD))) {

    var overlapping_shapes = 0;
    for (var a = 0; a < drawnItem.properties.OCD.length; a++) {
      var convex_shape = drawnItem.properties.OCD[a];
      var is_new_inside = check_this_shape_inside(new_shape_coordinates, convex_shape);
      if ((is_new_inside == 1) && (justOverlap)) {
        return 1;
      }
      else if (is_new_inside == 1) {
        overlapping_shapes += 1;
      };
    };

    if (overlapping_shapes == drawnItem.properties.OCD.length) {
      return 2;
    }
    else if (overlapping_shapes > 0) {
      return 1;
    }
    else {
      return 0
    };

  }
  else {
    return check_this_shape_inside(new_shape_coordinates, old_shape_coordinates);
  };

};

var check_this_shape_for_overlapping = function(shape, theItems, justOverlap, completeParent, completeChildren) {

  //shape -- the new shape drawn
  //theItems -- the existing shapes
  //justOverlap -- Boolean to decide if interested in full details (false) or just return as soon as anything overlaps at all (true)
  //completeParent -- (false) returns the layer that the new shape is entirely inside as soon as found, (true) keeps running checks before returning full details
  //completeChildren -- (false) returns the first layer inside the new shape that is found, (true) keeps running checks before returning full details

  //[number, overlap_array, parent_array, children_array]
  //where number: 0 = no overlap, 1 = overlap, 2 = new shape is child, 3 = new shape is parent

  var children_vectors = [];
  var parent_vectors = [];

  for (var i in theItems._layers) {
    var layer = theItems._layers[i];
    var drawnItem = layer.toGeoJSON();
    var checking_overlapping_inside = check_this_geoJSON(shape, drawnItem, justOverlap);
    if (checking_overlapping_inside == 1) {
      return [1, [layer._leaflet_id]];
    }
    else if (completeParent && (checking_overlapping_inside == 2)) {
      parent_vectors.push(layer);
    }
    else if (checking_overlapping_inside == 2) {
      return [2, [], [layer]];
    }
    else {
      ///check the reverse to see if any of the existing drawnItems are entirely inside the new shape
      var checking_enclosing = check_this_geoJSON(drawnItem, shape);
      if (completeChildren && (checking_enclosing == 2)){
        children_vectors.push(layer);
      }
      else if (checking_enclosing == 2){
        return [3, [], [], [layer]];
      };
    };    
  };

  if (children_vectors.length > 0) {
    return [3, [], parent_vectors, children_vectors];
  }
  else if (parent_vectors.length > 0) {
    return [2, [], parent_vectors, children_vectors];
  }
  else {
    return [0];
  };
  
};













/////Calculating Merge Shape

var polyanno_calculate_gap_length = function(vertex1, vertex2) {
  var x_gap = vertex1[0] - vertex2[0];
  var y_gap = vertex1[1] - vertex2[1];
  return Math.sqrt((x_gap * x_gap)+(y_gap * y_gap));
};

var polyanno_find_nearest_vectors = function(current_shortest_array, vertex, shape) {
  ///[gap_length_value, shape2_index]
  var shortest_gap = current_shortest_array;
  for (var a=0; a < shape.length; a++) {
    var the_gap = polyanno_calculate_gap_length(vertex, shape[a]);
    if (the_gap < shortest_gap[0]) {  shortest_gap = [the_gap, a];  };
  };
  return shortest_gap;
};

var polyanno_find_shortest_branch = function(shape1, shape2) {
  ///[gap_length_value, shape1_index, shape2_index]
  var shortest_gap_array = [polyanno_calculate_gap_length(shape1[0],shape2[0]), 0, 0];
  for (var a=0; a < shape1.length; a++) {
     ///[gap_length_value, shape2_index]
    var gap_array = polyanno_find_nearest_vectors([shortest_gap_array[0]], shape1[a], shape2);
    if (gap_array[0] < shortest_gap_array[0]) { shortest_gap_array = [gap_array[0], a, gap_array[1]]; };
  };  
  return shortest_gap_array;
};

var polyanno_form_neighbour_index_array = function(shape, main_index){
  var prev;
  var next;
  if (main_index==0) {  prev = shape.length -2; }
  else {  prev = main_index - 1 };
  if (main_index==(shape.length -1)){  next = 1 }
  else {  next = main_index +1 };
  return [prev, next];
};

var sort_out_edge_direction = function(shortest, neighbour_value, neighbour_index_array) {
  //the bridge shape needs to run in the opposite direction to the shape it has come from to be clockwise
  if (neighbour_value == 0) {   return [shortest, neighbour_index_array[0]];    }
  else {    return [neighbour_index_array[1], shortest];    };  
};

var polyanno_calculate_merge_shape_index = function(shape1, shape2) {
  ///[gap_length_value, shape1_index, shape2_index]
  var the_shortest_branch_array = polyanno_find_shortest_branch(shape1, shape2);
  //[previous_neighbour_index, next_neighbour_index]
  var shape1_shortest_neighbours_index = polyanno_form_neighbour_index_array(shape1, the_shortest_branch_array[1]);
  var shape2_shortest_neighbours_index = polyanno_form_neighbour_index_array(shape2, the_shortest_branch_array[2]);
  //[previous_neighbour, next_neighbour]
  var shape1_shortest_neighbours = [shape1[shape1_shortest_neighbours_index[0]], shape1[shape1_shortest_neighbours_index[1]]];
  var shape2_shortest_neighbours = [shape2[shape2_shortest_neighbours_index[0]], shape2[shape2_shortest_neighbours_index[1]]];
  ///[gap_length_value, shape1_neighbours_array_index, shape2_neighbours_array_index]
  var shortest_neighbour_branch_array = polyanno_find_shortest_branch(shape1_shortest_neighbours, shape2_shortest_neighbours);

  var shape1_edge = sort_out_edge_direction(the_shortest_branch_array[1], shortest_neighbour_branch_array[1], shape1_shortest_neighbours_index);
  var shape2_edge = sort_out_edge_direction(the_shortest_branch_array[2], shortest_neighbour_branch_array[2], shape2_shortest_neighbours_index);
  return [shape1_edge[0], shape1_edge[1], shape2_edge[0], shape2_edge[1]];
};

var find_edge_intersection = function(edge1_v1, edge1_v2, edge2_v1, edge2_v2) {

  var edge1_slope = (edge1_v2[1]-edge1_v1[1])/(edge1_v2[0]-edge1_v1[0]);
  var edge2_slope = (edge2_v2[1]-edge2_v1[1])/(edge2_v2[0]-edge2_v1[0]);
  var edge1_x_offset = edge1_v1[1] - (edge1_v1[0] * edge1_slope);
  var edge2_x_offset = edge2_v1[1] - (edge2_v1[0] * edge2_slope);
  var x_intersect = (edge2_x_offset - edge1_x_offset) / (edge1_slope - edge2_slope);

  //edge1 is assumed to be the "real" shape edge and so needs to be within shape boundary
  if ( ( (x_intersect <= edge1_v1[0]) && (x_intersect >= edge1_v2[0]) ) || (  (x_intersect >= edge1_v1[0]) && (x_intersect <= edge1_v2[0])  ) ) {
    var y_intersect = (edge1_slope * x_intersect) + edge1_x_offset;
    return [x_intersect, y_intersect];
  }
  else {  return false; };
};

var polyanno_redirect_shape_boundary = function(initial_geometry, convex_shape, conflict_vertex_index) {
  ///find where the conflict edge intersects with the initial_geometry_edge
  var vertex1_index = conflict_vertex_index - 1;
  var new_geometry = [];
  if (conflict_vertex_index == 0) { vertex1_index = convex_shape.length - 1;  };
  for (var i=0; i < initial_geometry.length; i++) {
    var second_v = i + 1;
    if (i == (initial_geometry.length - 1)) { second_v = 0  };
    var intersects = find_edge_intersection(initial_geometry[i], initial_geometry[second_v], convex_shape[vertex1_index], convex_shape[conflict_vertex_index]);
    if (intersects != false) {  initial_geometry.splice(second_v, 0, intersects); new_geometry = initial_geometry; };
  };
  return new_geometry;
};

var polyanno_overlap_looping = function(initial_geometry, convex_shape) {
  var new_geometry = false;
  for (var a=0; a < convex_shape.length; a++) {
    var this_vertex = convex_shape[a];
    var is_overlapping = check_if_overlapping(this_vertex, initial_geometry);
    if (is_overlapping) {
      return polyanno_redirect_shape_boundary(initial_geometry, convex_shape, a);
    };
  };
  return new_geometry;
};

var polyanno_find_and_fix_overlap = function(initial_geometry, convex_shape) {
  ///need to find fix if 
  var the_geometry = initial_geometry;
  var reiterate = true;
  while (reiterate) {
    var new_geometry = polyanno_overlap_looping(the_geometry, convex_shape);
    if (new_geometry == false) {
      return the_geometry;
    }
    else {
      the_geometry = new_geometry;
    };
  };
};

var polyanno_merge_overlap_iteration = function(initial_geometry, drawnItem) {
  var geometry_array = initial_geometry;
  if (!isUseless(drawnItem.properties.OCD)) {
      for (var a = 0; a < drawnItem.properties.OCD.length; a++) {
        var convex_shape = drawnItem.properties.OCD[a];
        geometry_array = polyanno_find_and_fix_overlap(geometry_array, convex_shape);
      };
      return geometry_array;
    }
    else {
      var convex_shape = drawnItem.geometry.coordinates[0];
      return polyanno_find_and_fix_overlap(geometry_array, convex_shape);
    };

};

var polyanno_merge_shape_avoid_overlap = function(initial_geometry, merge_array) {
  var geometry_array = initial_geometry;
  Polyanno.L.vectors.eachLayer(function(layer){
      if (merge_array.includes(layer)) {    } //unsure if this will work with the file types involved?
      else {
        var drawnItem = layer.toGeoJSON();
        geometry_array = polyanno_merge_overlap_iteration(geometry_array, drawnItem);
      };
  });
  return geometry_array;
};






////buildingParents

Polyanno.buildingParents = {
  status: false,
  vectors: [],
  transcriptions: [],
  translations: [],
  parent: {
    vector : false ///Leaflet layer not just GeoJSON
    //transcription
    //translation
  },
  numbers: {},
  vector: {},
  annos: {}
};

//Methods

Polyanno.buildingParents.clicked = function(vec) {

  vec.layer.closePopup();

  if (Polyanno.buildingParents.vectors.includes(vec.layer)) {
    //unclick and remove this vector
    var the_index = Polyanno.buildingParents.vectors.indexOf(vec.layer);
    Polyanno.buildingParents.numbers.remove(vec.layer, Polyanno.buildingParents.vectors, the_index);
    Polyanno.buildingParents.vectors.splice(the_index, 1);
    Polyanno.buildingParents.annos.remove(vec.layer);
    Polyanno.buildingParents.vector.remove(vec.layer, Polyanno.buildingParents.parent.vector);
  }
  else if (!isUseless(Polyanno.buildingParents.parent.vector)) {
    //click and merge this vector
    ///need to introduce parent checks??
    Polyanno.buildingParents.vectors.push(vec.layer);
    Polyanno.buildingParents.annos.add(vec.layer);
    Polyanno.buildingParents.vector.update(Polyanno.buildingParents.parent.vector, vec.layer, Polyanno.buildingParents.vectors);
    Polyanno.buildingParents.numbers.add(vec.layer, Polyanno.buildingParents.vectors.length);
  }
  else {
    //click and start the new merge shape
    Polyanno.buildingParents.vectors.push(vec.layer);
    Polyanno.buildingParents.annos.add(vec.layer);
    Polyanno.buildingParents.vector.new(vec.layer);
    Polyanno.buildingParents.numbers.add(vec.layer, Polyanno.buildingParents.vectors.length);
  };

};



///vector

Polyanno.buildingParents.vector.calculateNewParent = function(shape1, shape2, merge_array) {
  //[v1_index_shape1, v2_index_shape1, v3_index_shape2, v4_index_shape2]
  var bridge_index_array = polyanno_calculate_merge_shape_index(shape1, shape2);
  //[v2, v3, v4, v1]
  var bridge_initial_geometry = [shape1[bridge_index_array[1]], shape2[bridge_index_array[2]], shape2[bridge_index_array[3]], shape1[bridge_index_array[0]]];
  //[shape1_2, ... v1, v2 .... , shape2_1, shape2_2, ...v1, v2 .... shape1_1]
  var bridge_final_geometry = polyanno_merge_shape_avoid_overlap(bridge_initial_geometry, merge_array);

  //the bridge shape is running clockwise too so the adjacent edges are in the reverse order
  var shape1_segment = polyanno_find_shape_between(shape1, bridge_index_array[0], bridge_index_array[1]); //shape1 between v1 to v2
  var shape2_segment = polyanno_find_shape_between(shape2, bridge_index_array[2], bridge_index_array[3]); //shape2 between v3 and v4
  var index_of_v4 = bridge_final_geometry.indexOf(bridge_initial_geometry[2]); 
  var bridge_shape_start = bridge_final_geometry.slice(0, index_of_v4); // v2 to v3
  var bridge_shape_end = bridge_final_geometry.slice(index_of_v4); // v4 to v1
  var final_coords = shape1_segment.slice(0,1);
  var final_merge_shape_coords = shape1_segment.concat(bridge_shape_start, shape2_segment, bridge_shape_end, final_coords); //the first and last coordinates need to be identical
  return final_merge_shape_coords;
};

Polyanno.buildingParents.vector.replace = function(old_shape, new_shape) {
  ///replace with setLatLngs method??
  Polyanno.L.suggestedParentVector.removeLayer(old_shape);

  L.geoJson(new_shape, 
        { style: {color: Polyanno.colours.processing.vector },
          onEachFeature: function (feature, layer) {
            Polyanno.L.suggestedParentVector.addLayer(layer),
            layer.bringToBack(),
            Polyanno.buildingParents.parent.vector = layer
          }
        }).addTo(Polyanno.L.map);
  Polyanno.L.suggestedParentVector.bringToBack();
};

Polyanno.buildingParents.vector.new = function(shape_to_copy) {

  var shapeGeoJSON = shape_to_copy.toGeoJSON();
  var tempGeoJSON = {  
    "type": "Feature",  
    "properties":{   
      "children": [shape_to_copy._leaflet_id],
      "transcription": Polyanno.buildingParents.transcriptions,
      "translation": Polyanno.buildingParents.translations    
    },  
    "geometry":{"type": "Polygon", "coordinates": shapeGeoJSON.geometry.coordinates}  
  };
  if ((!isUseless(shapeGeoJSON.properties))&&(!isUseless(shapeGeoJSON.properties.OCD)) ) {
    tempGeoJSON.properties.OCD = shapeGeoJSON.properties.OCD;
  };

  L.geoJson(tempGeoJSON, 
        { style: {color: Polyanno.colours.processing.vector },
          onEachFeature: function (feature, layer) {
            Polyanno.L.suggestedParentVector.addLayer(layer),
            layer.bringToBack(),
            Polyanno.buildingParents.parent.vector = layer
          }
        }).addTo(Polyanno.L.map);
  Polyanno.L.suggestedParentVector.bringToBack();
};

Polyanno.buildingParents.vector.update = function(temp_shape_layer, new_vec_layer, merge_array) {

  var old_shape_JSON = temp_shape_layer.toGeoJSON();
  var old_shape_coords = old_shape_JSON.geometry.coordinates[0];
  var new_vec_JSON = new_vec_layer.toGeoJSON();
  var new_vec_coords = new_vec_JSON.geometry.coordinates[0];

  var new_merge_coords = Polyanno.buildingParents.vector.calculateNewParent(old_shape_coords, new_vec_coords, merge_array);

  ///*** add geometric properties checks here
  var concavity_check; // = check_for_concavity(new_merge_coords);
  var tempGeoJSON = old_shape_JSON;
  if (isUseless(tempGeoJSON.properties)) {  tempGeoJSON.properties = {};  };
  if (!isUseless(concavity_check)) {
    tempGeoJSON.properties.OCD = concavity_check;
  };
  tempGeoJSON.geometry.coordinates[0] = new_merge_coords;

  tempGeoJSON.properties.transcription = Polyanno.buildingParents.transcriptions;
  tempGeoJSON.properties.translation = Polyanno.buildingParents.translations;
  tempGeoJSON.properties.children.push(new_vec_layer._leaflet_id);

  Polyanno.buildingParents.vector.replace(temp_shape_layer, tempGeoJSON);

};

Polyanno.buildingParents.vector.remove = function(vec_removed, merge_shape) {

  var old_shape_JSON = merge_shape.toGeoJSON();
  var removing_shape_JSON = vec_removed.toGeoJSON();
  var old_coords = old_shape_JSON.geometry.coordinates[0];
  var removing_coords = removing_shape_JSON.geometry.coordinates[0];
  var removing_coords_strings = removing_coords.map(function(v){
    return JSON.stringify(v);
  });

  var new_coords = old_coords.filter(function(vertex){
    return !removing_coords_strings.includes(JSON.stringify(vertex));
  });
  if ( JSON.stringify(new_coords[0]) != JSON.stringify(new_coords[new_coords.length-1]) ) {
    var loop_v = new_coords[0];
    new_coords.push(loop_v);
  };
  var new_shape = old_shape_JSON;
  new_shape.geometry.coordinates[0] = new_coords;

  ///*** add geometric properties checks here

  Polyanno.buildingParents.vector.replace(merge_shape, new_shape);

};

Polyanno.buildingParents.addParentLayer = function() {
  var thisJSON = Polyanno.buildingParents.parent.vector.toGeoJSON();
  var submitted_layer_id;
  L.geoJson(thisJSON, 
        { style: {color: Polyanno.colours.larger_vector},
          onEachFeature: function (feature, layer) {
            Polyanno.L.vectors.addLayer(layer),
            submitted_layer_id = layer._leaflet_id,
            layer.bringToBack()
          }
        }).addTo(Polyanno.L.map);
  Polyanno.L.suggestedParentVector.removeLayer(Polyanno.buildingParents.parent.vector);  
  var submitted_layer = Polyanno.L.vectors.getLayer(submitted_layer_id);
  return submitted_layer;    
};

Polyanno.buildingParents.vector.submitted = function (merged_vector) {

  for (var i=0; i < Polyanno.buildingParents.vectors.length; i++) {
    var this_layer = Polyanno.buildingParents.vectors[i];
    var this_layer_id = this_layer._leaflet_id;
    var this_vec = Polyanno.vectors.getById(this_layer_id);
    this_vec.update({ parent: merged_vector  });
    var thisAnno = Polyanno.getAnnotationByBody(this_layer_id);
    thisAnno.addTargets([{"id": merged_vector.id, "format": "image/SVG"}]);
  };

};  

//numbers

Polyanno.buildingParents.numbers.labels = [];

Polyanno.buildingParents.numbers.hover_opts = {
    sticky: true,
    permanent: false,
    direction: 'auto'
};

Polyanno.buildingParents.numbers.new = function(this_vec, number) {
  var the_number_label = "<div style='background-color: white; padding: 10px 18px 10px 12px; border-radius: 5px; margin: -12px 0px 0px -12px; text-align: center;'><span> "+number+" </span></div>";
  var centroidLtLngs = this_vec.getBounds().getCenter();
  var numIcon = new L.divIcon({html: the_number_label});
  var labelMarker = new L.marker(centroidLtLngs, {icon: numIcon});
  labelMarker.addTo(Polyanno.L.map);
  return labelMarker;
};

Polyanno.buildingParents.numbers.add = function(new_vec, number) {
  var labelMarker = Polyanno.buildingParents.numbers.new(new_vec, number);
  Polyanno.buildingParents.numbers.labels.push(labelMarker);
  new_vec.unbindTooltip();
  new_vec.bindTooltip(polyanno_merging_added_shape_HTML, Polyanno.buildingParents.numbers.hover_opts).openTooltip();
};

Polyanno.buildingParents.numbers.remove = function(vec_removed, merge_array, array_index) {
  vec_removed.unbindTooltip();
  vec_removed.bindTooltip(polyanno_merging_new_shape_HTML, Polyanno.buildingParents.numbers.hover_opts).openTooltip();
  for (var i=array_index+1; i < merge_array.length; i++) {
    Polyanno.L.map.removeLayer(Polyanno.buildingParents.numbers.labels[i]);
    var labelMarker = Polyanno.buildingParents.numbers.new(merge_array[i], i);
    Polyanno.buildingParents.numbers.labels.splice(i, 1, labelMarker);
  };
  Polyanno.L.map.removeLayer(Polyanno.buildingParents.numbers.labels[array_index]);
  Polyanno.buildingParents.numbers.labels.splice(array_index, 1);
};

Polyanno.buildingParents.numbers.rearrange = function(old_array_index, new_array_index) {

  var arr = Polyanno.buildingParents.vectors;
  var vec = arr[old_array_index];

  Polyanno.L.map.removeLayer(Polyanno.buildingParents.numbers.labels[old_array_index]);
  var labelMarker = Polyanno.buildingParents.numbers.new(vec, new_array_index+1);

  /////only numbers between old and new are affected
  
  //if the old index is earlier than the new one
  if (old_array_index < new_array_index) {
    for (var i=old_array_index+1; i <= new_array_index; i++) {
      Polyanno.L.map.removeLayer(Polyanno.buildingParents.numbers.labels[i]);
      var labelMarker = Polyanno.buildingParents.numbers.new(arr[i], i);
      Polyanno.buildingParents.numbers.labels.splice(i, 1, labelMarker);
    };
  }
  //if the old index is later than the new one
  else if (old_array_index > new_array_index) {
    for (var i=new_array_index; i < old_array_index; i++) {
      Polyanno.L.map.removeLayer(Polyanno.buildingParents.numbers.labels[i]);
      var labelMarker = Polyanno.buildingParents.numbers.new(arr[i], i+2);
      Polyanno.buildingParents.numbers.labels.splice(i, 1, labelMarker);
    };
  };

  Polyanno.buildingParents.numbers.labels.splice(old_array_index, 1);
  Polyanno.buildingParents.numbers.labels.splice(new_array_index, 0, labelMarker); 

};

Polyanno.buildingParents.numbers.activated = function() {

  Polyanno.L.vectors.eachLayer(function(vec){
    vec.bindTooltip(polyanno_merging_new_shape_HTML, {
      sticky: true,
      permanent: false,
      direction: 'auto'
    }).openTooltip();
  });
 
};

Polyanno.buildingParents.numbers.deactivated = function() {
  //if a shape has been rearranged then the label is not removed..????
  for (var i=0; i < Polyanno.buildingParents.numbers.labels.length; i++) {
    Polyanno.L.map.removeLayer(Polyanno.buildingParents.numbers.labels[i]);
  };
  Polyanno.buildingParents.numbers.labels = [];
  Polyanno.L.vectors.eachLayer(function(vec){
    vec.unbindTooltip();
  });
};




///annos

Polyanno.buildingParents.annos.addSpan = function(this_json, text_type) {
  var this_display_id = "#polyanno_merging_"+text_type;
  var old_text = $(this_display_id).html();
  var new_frag_id = this_json._id;
  var this_class = text_type.concat("-text");
  var the_new_span = "<a class='" + Polyanno.textHighlighting.findSpanClass(this_class) + " ' id='" + new_frag_id + "' >" + this_json.text + "</a>";
  var new_text = old_text.concat(the_new_span);
  $(this_display_id).html(new_text);

  return $("#"+new_frag_id); 
};

Polyanno.buildingParents.annos.addJSON = function(new_vec, textType) {
  var plural = textType.concat("s");
  var targets = Polyanno.selected[plural].array;
  if (targets.length == 0) {
    var newID = Math.random().toString().substring(2);
    var id = Polyanno.urls[textType].concat(newID);
    var vec = Polyanno.vectors.getById(new_vec._leaflet_id);
    return {"_id": newID, "id": id, "text": "   ", "vector": new_vec._leaflet_id, "isNew": true, metadata: imageSelectedMetadata, 
    target: [ {id: new_vec._leaflet_id,  format: "image/SVG"  }, 
    {id: imageSelected,  format: "application/json"  } ]};
  }
  else {
    return targets[0];
  };
};

Polyanno.buildingParents.annos.add = function(new_vec_obj) {

  var transcriptionJSON = Polyanno.buildingParents.annos.addJSON(new_vec_obj, "transcription");
  Polyanno.buildingParents.transcriptions.push(transcriptionJSON);
  var transcriptionSpan = Polyanno.buildingParents.annos.addSpan(transcriptionJSON, "transcription");

  var translationJSON = Polyanno.buildingParents.annos.addJSON(new_vec_obj, "translation");
  Polyanno.buildingParents.translations.push(translationJSON);
  var translationSpan = Polyanno.buildingParents.annos.addSpan(translationJSON, "translation"); 

};

Polyanno.buildingParents.annos.removeText = function(text_type, children_array, vec) {
  var the_display_dom = document.getElementById("polyanno_merging_"+text_type);
  var this_child_array = $.grep(children_array, function(item, index){
    return item.vector == vec._leaflet_id;
  });
  var this_child = this_child_array[0];
  var this_frag_dom = document.getElementById(this_child._id);

  the_display_dom.removeChild(this_frag_dom);
  var the_array_index = children_array.indexOf(this_child);
  children_array.splice(the_array_index, 1);
  return children_array;
};

Polyanno.buildingParents.annos.remove = function(vec_removed_layer) {
  Polyanno.buildingParents.transcriptions = Polyanno.buildingParents.annos.removeText("transcription", Polyanno.buildingParents.transcriptions, vec_removed_layer);
  Polyanno.buildingParents.translations = Polyanno.buildingParents.annos.removeText("translation", Polyanno.buildingParents.translations, vec_removed_layer);
};

Polyanno.buildingParents.annos.addText = function(merged_vector, textType) {
  var plural = textType.concat("s");
  var htmlID = "#polyanno_merging_".concat(textType);
  var linkedText = $(htmlID).html();
  var data = {text: linkedText, vector: merged_vector.id, metadata: imageSelectedMetadata, 
    target: [
            {id: merged_vector,  format: "image/SVG"  },
            {id: imageSelected,  format: "application/json"  } ]
  };

  var createdText = new Polyanno[textType](data);
  Polyanno[plural].add(createdText);
  data.body = createdText;
  var newAnno = new Polyanno.annotation(data);
  Polyanno.annotations.add(newAnno);
  return createdText;
};

Polyanno.buildingParents.annos.updateChildren = function(merged_vector, merged_text, textType) {

  var plural = textType.concat("s");
  var updatedTarget = [{"id": merged_text.id, "format": "application/json"}];

  for (var i=0; i < Polyanno.buildingParents[plural].length; i++) {
    var this_json = Polyanno.buildingParents[plural][i];
    updatedTarget.push({"id": merged_text.id.concat(".text#"+this_json._id), "format": "text/html"});
    if (this_json.isNew) {

      this_json.parent = merged_text;
      this_json.target = this_json.target.concat(updatedTarget);

      var createdText = new Polyanno[textType](this_json);
      Polyanno[plural].add(createdText);
      this_json.body = createdText;
      var newAnno = new Polyanno.annotation(this_json);
      Polyanno.annotations.add(newAnno);
      setInitialRank(textType, createdText);
    }
    else {
      this_json.update({"parent": merged_text});
      var thisAnno = Polyanno.getAnnotationByBody(this_json.id);
      thisAnno.addTargets(updatedTarget);
      setInitialRank(textType, this_json);
    };
  };
};

Polyanno.buildingParents.annos.submitted = function(merged_vector) {
  var linkedTranscription = Polyanno.buildingParents.annos.addText(merged_vector, "transcription");
  var linkedTranslation = Polyanno.buildingParents.annos.addText(merged_vector, "translation");
  Polyanno.buildingParents.annos.updateChildren(merged_vector, linkedTranscription, "transcription");
  Polyanno.buildingParents.annos.updateChildren(merged_vector, linkedTranslation, "translation");
};








///states


var animate_restore_image_box_focus = function(callback_function) {
  $(".annoPopup").css("opacity", 1.0);
  $("#imageViewer")
  .removeClass(function (index, className) {
      return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
  })
  .addClass("col-md-4");
  callback_function();
};

var animate_moving_image_box_focus_end = function(callback_function) {
  $(".annoPopup").css("opacity", 0.3); ///animate this??
  $("#imageViewer")
  .css("opacity", 1.0)
  .removeClass(function (index, className) {
      return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
  })
  .addClass("col-md-6");
  callback_function();
};



Polyanno.buildingParents.activated = function() {

  ///status ---> should this be evented??
  Polyanno.buildingParents.status = true;



  ///disabled unnecessary functionailty
  Polyanno.L.drawControl.default.remove();
  polyanno_disable_keyboards();

  Polyanno.L.map.fitBounds(Polyanno.L.vectors.getBounds());
  Polyanno.buildingParents.numbers.activated();

  animate_moving_image_box_focus_end(function() {
    $(".polyanno_merging_annos")
    .hide()
    .css("opacity", 0.9).removeClass(function (index, className) {
        return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
    }).addClass("col-md-3");
  });

  ///annos being merged
  var this_transcription_display = add_dragondrop_pop("polyanno_merging_annos", Polyanno.HTML.buildingParents.Transcriptions, "polyanno-page-body", true, Polyanno.HTML.symbols.buildingParent.transcription, true);
  $(this_transcription_display).toggle().insertAfter($("#imageViewer"));
  var ivh = $("#imageViewer").css("height");
  $(this_transcription_display).css("height", ivh);
  var this_translation_display = add_dragondrop_pop("polyanno_merging_annos", Polyanno.HTML.buildingParents.Translations, "polyanno-page-body", true, Polyanno.HTML.symbols.buildingParent.translation, true);
  $(this_translation_display).toggle().insertAfter($("#imageViewer"));
  var ivh = $("#imageViewer").css("height");
  $(this_translation_display).css("height", ivh);

  $("#polyanno_merging_transcription").sortable({
    forcePlaceholderSize: true,
    placeholder: "polyanno_merging_placeholder",
    start: function(event, ui) {
      var s = $(ui.item).attr("id");
      var arr = $.grep(Polyanno.buildingParents.transcriptions, function(t) {
        return t._id == s;
      });
      Polyanno.colours.highlightThis.vector(arr[0].vector, Polyanno.colours.processing.vector);
      $(ui.item).css("background-color", Polyanno.colours.processing.span);
    },
    stop: function(event, ui) {
      var s = $(ui.item).attr("id");
      var arr = $.grep(Polyanno.buildingParents.transcriptions, function(t) {
        return t._id == s;
      });
      Polyanno.colours.highlightThis.vector(arr[0].vector, Polyanno.colours.default.vector);
      $(ui.item).css("background-color", Polyanno.colours.default.span);
    },    
    update: function(event, ui) {
      var s = $(ui.item).attr("id");
      var arr = $.grep(Polyanno.buildingParents.transcriptions, function(t) {
        return t._id == s;
      });

      var old = Polyanno.buildingParents.transcriptions.indexOf(arr[0]); 
      var newIndex = $(ui.item).index();

      Polyanno.buildingParents.numbers.rearrange(old, newIndex); 

      var the_transcription = Polyanno.buildingParents.transcriptions[old];
      Polyanno.buildingParents.transcriptions.splice(old, 1);
      Polyanno.buildingParents.transcriptions.splice(newIndex, 0, arr[0]);

      var the_translation = Polyanno.buildingParents.translations[old];
      Polyanno.buildingParents.translations.splice(old, 1);
      Polyanno.buildingParents.translations.splice(newIndex, 0, the_translation);

      var the_vector = Polyanno.buildingParents.vectors[old];
      Polyanno.buildingParents.vectors.splice(old, 1);
      Polyanno.buildingParents.vectors.splice(newIndex, 0, the_vector);

    }
  });
  $("#polyanno_merging_translation").sortable({
    forcePlaceholderSize: true,
    placeholder: "polyanno_merging_placeholder",
    start: function(event, ui) {
      var s = $(ui.item).attr("id");
      var arr = $.grep(Polyanno.buildingParents.transcriptions, function(t) {
        return t._id == s;
      });
      Polyanno.colours.highlightThis.vector(arr[0].vector, Polyanno.colours.processing.vector);
      $(ui.item).css("background-color", Polyanno.colours.processing.span);
    },
    stop: function(event, ui) {
      var s = $(ui.item).attr("id");
      var arr = $.grep(Polyanno.buildingParents.transcriptions, function(t) {
        return t._id == s;
      });
      Polyanno.colours.highlightThis.vector(arr[0].vector, Polyanno.colours.default.vector);
      $(ui.item).css("background-color", Polyanno.colours.default.span);
    },    
    update: function(event, ui) {
      var s = $(ui.item).attr("id");
      var arr = $.grep(Polyanno.buildingParents.transcriptions, function(t) {
        return t._id == s;
      });

      var old = Polyanno.buildingParents.transcriptions.indexOf(arr[0]); 
      var newIndex = $(ui.item).index();

      Polyanno.buildingParents.numbers.rearrange(old, newIndex); 

      var the_transcription = Polyanno.buildingParents.transcriptions[old];
      Polyanno.buildingParents.transcriptions.splice(old, 1);
      Polyanno.buildingParents.transcriptions.splice(newIndex, 0, arr[0]);

      var the_translation = Polyanno.buildingParents.translations[old];
      Polyanno.buildingParents.translations.splice(old, 1);
      Polyanno.buildingParents.translations.splice(newIndex, 0, the_translation);

      var the_vector = Polyanno.buildingParents.vectors[old];
      Polyanno.buildingParents.vectors.splice(old, 1);
      Polyanno.buildingParents.vectors.splice(newIndex, 0, the_vector);

    }
  });

  $(".polyanno-merge-transcriptions-btn").on("click", function(event){  $(this_transcription_display).toggle("fold");  });
  $(".polyanno-merge-translations-btn").on("click", function(event){  $(this_translation_display).toggle("fold");  });

  $("#polyanno-merge-shapes-enable").addClass("active");
  $(".polyanno-merging-buttons").toggle("swing");

  /*
  L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
        var img = L.DomUtil.create('img');

        img.src = '../../docs/images/logo.png';
        img.style.width = '200px';

        return img;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
  });

  L.control.watermark = function(opts) {
      return new L.Control.Watermark(opts);
  }

  L.control.watermark({ position: 'bottomleft' }).addTo(map);
*/
};


Polyanno.buildingParents.deactivated = function() {

  Polyanno.buildingParents.status = false;
 
  //reset variables
  Polyanno.buildingParents.numbers.deactivated();
  Polyanno.buildingParents.parent.vector = false;
  Polyanno.buildingParents.transcriptions = [];
  Polyanno.buildingParents.translations = [];
  Polyanno.buildingParents.vectors = [];

  $(".annoPopup").css("opacity", 1.0);
  polyanno_enable_keyboards();
  $("#polyanno-merge-shapes-enable").removeClass("active");
  $(".polyanno-merging-buttons").toggle("swing");

  var transcription_id = $("#polyanno_merging_transcription").closest(".annoPopup").attr("id");
  var translation_id = $("#polyanno_merging_translation").closest(".annoPopup").attr("id");
  dragondrop_remove_pop(transcription_id);
  dragondrop_remove_pop(translation_id);

};

Polyanno.buildingParents.submitted = function(vector) {
  Polyanno.buildingParents.annos.submitted(vector);
  Polyanno.buildingParents.vector.submitted(vector);
  Polyanno.buildingParents.deactivated();
};




Polyanno.buildingParents.btn_events = function() {

  $("#polyanno-merge-shapes-enable").on("click", function(event){

    Polyanno.buildingParents.activated();

  });

  $(".polyanno-merge-shapes-submit-btn").on("click", function (event) {

    Polyanno.L.drawControl.default.addTo(Polyanno.L.map);

    if (Polyanno.buildingParents.vectors.length > 1) {
      var layer = Polyanno.buildingParents.addParentLayer();
      var shape = layer.toGeoJSON(); 
      var the_children_array;
      for (var i=0; i < Polyanno.buildingParents.vectors; i++) {
        var this_json = Polyanno.buildingParents.vectors[i].toGeoJSON();
        the_children_array.push(this_json);
      };
      polyanno_new_vector_made(layer, shape, false, the_children_array, Polyanno.buildingParents.submitted, true); //layer, shape, parent, children, callback, fromMerge
    }
    else {
      Polyanno.L.suggestedParentVector.removeLayer(Polyanno.buildingParents.parent.vector);
      Polyanno.buildingParents.deactivated();
    };
  }); 

  $(".polyanno-merge-shapes-cancel-btn").on("click", function(event){

    Polyanno.L.drawControl.default.addTo(Polyanno.L.map);

    Polyanno.L.suggestedParentVector.removeLayer(Polyanno.buildingParents.parent.vector);
    Polyanno.buildingParents.deactivated();
  });

};








//////IIIF

Polyanno.image = {};

Polyanno.image.generateRegionURL = function(coordinates) {

  ///need to allow polygon encoding in IIIF regions

    /*

    NOTE ABOUT COORDINATES

    + Leaflet Simple CRS has (0,0) in top left corner 
    + GeoJSON coordinates go clockwise from bottom left
    + IIIF has downwards +y axis
    _____________________  
    |*-----> x          |           
    ||                  |           [2] ---> [3] 
    |v                  |            ^        |
    |-y                 |            |        v
    |                   |           [1] <--- [4]
    |    L.CRS.Simple   |
    |                   |        GeoJSON Coordinates
    |                   | 
    |                   | 
    ---------------------    

    */
    var xy1 = coordinates[0];
    var xy2 = coordinates[1];
    var xy3 = coordinates[3];

    var x = xy2[0];
    var y = -xy2[1];
    var w = xy3[0] - xy2[0];
    var h = xy2[1] - xy1[1];
    var paramURL = x.toString() + "," + y.toString() + "," + w.toString() + "," + h.toString() + "/full/0/default";

    return paramURL;
};

Polyanno.image.outerRectangle = function(coordinates){
  var left = coordinates[0][0];
  var right = coordinates[0][0];
  var top = coordinates[0][1];
  var bottom = coordinates[0][1];
  for (var i=0; i <coordinates.length; i++) {
    var this_x = coordinates[i][0];
    var this_y = coordinates[i][1];
    if (this_x < left) {  left = this_x   }
    else if (this_x > right) {  right = this_x   }
    else if (this_y < bottom) {  bottom = this_y   }
    else if (this_y > top) {  top = this_y   };
  };
  return [[left, bottom],[left, top],[right, top],[right, bottom],[left, bottom]];
};

Polyanno.image.getIIIFURL = function (imageJSON, coordinates, format) {

    var imagewithoutinfo = imageJSON.split("info.json",1);
    var imagewithoutinfoURL = imagewithoutinfo[0];

    //use the IIIF Image Section API somehow??
    var rect = Polyanno.image.outerRectangle(coordinates);

    var regionParams = Polyanno.image.generateRegionURL(rect);
    var theURL = imagewithoutinfoURL.concat(regionParams + "." + format);

    return theURL;
};

/////LUNA IIIF DATA

Polyanno.image.findTitle = function(IIIFmetadata) {
  var polyanno_searchingIIIF = $.grep(IIIFmetadata, function(e){ 
      if (!isUseless(e.label)) {
        return e.label == "Repro Title"; 
      }
      else {
        return false;
      };
  });
    if (!isUseless(polyanno_searchingIIIF)) {
      return polyanno_searchingIIIF[0].value;
    }
    else {
      return " ";
    };
};
Polyanno.image.findDescription = function(IIIFmetadata) {
  var polyanno_searchingIIIF = $.grep(IIIFmetadata, function(e){ 
      if (!isUseless(e.label)) {
        return e.label == "Description"; 
      }
      else {
        return false;
      };
  });
    if (!isUseless(polyanno_searchingIIIF)) {
      return polyanno_searchingIIIF[0].value;
    }
    else {
      return " ";
    };
};












/////////LEAFLET

Polyanno.L = {
  drawControl: {},
  vec_event: {}
};

Polyanno.L.vectors = new L.FeatureGroup();
Polyanno.L.suggestedParentVector = new L.FeatureGroup();

Polyanno.L.drawControl.default = new L.Control.Draw({
  draw: {
      polygon: {
        allowIntersection: false,
        shapeOptions: {
          color: Polyanno.colours.default.vector
        }
      },
      rectangle: {
        shapeOptions: {
          color: Polyanno.colours.default.vector
        }
      },  
      circle: false,      
      polyline: false,  //disables the polyline and marker feature as this is unnecessary for annotation of text as it cannot enclose it
      marker: false
  },
  edit: {
      featureGroup: Polyanno.L.vectors //passes draw control options to the FeatureGroup of editable layers
  }
});

Polyanno.L.drawControl.connectingEquals = new L.Control.Draw({
  draw: {
      polygon: {
        allowIntersection: false,
        shapeOptions: {
          color: Polyanno.colours.highlight.vector
        }
      },
      rectangle: {
        shapeOptions: {
          color: Polyanno.colours.highlight.vector
        }
      },  
      circle: false,      
      polyline: false,  //disables the polyline and marker feature as this is unnecessary for annotation of text as it cannot enclose it
      marker: false
  },
  edit: false
});


Polyanno.L.menu = {
  newVector: L.popup().setContent(popupVectorMenuHTML),
  overlaps: L.popup().setContent("<p>You cannot draw overlapping shapes.</p>"),
  isChild: L.popup().setContent("<p>Highlight the text first and then draw a smaller shape for it.</p>"),
  isParent: L.popup().setContent("<p>To make a larger shape you must connect the smaller shapes in order using the connecting button.</p>"),
  invalidConnectingEquals: L.popup().setContent("<p>Please draw inside the correct larger shape!</p>")
};
 


Polyanno.starting.leaflet = function() {

  Polyanno.L.map = L.map('polyanno_map');
  Polyanno.L.map.options.crs = L.CRS.Simple;
  Polyanno.L.map.options.maxBoundsViscosity = 0.9;
  Polyanno.L.map.setView(
    [0, 0], //centre coordinates
    0 //zoom needs to vary according to size of object in viewer but whatever
  );
  Polyanno.L.map.options.crs = L.CRS.Simple;

  Polyanno.L.iiifLayer = L.tileLayer.iiif(imageSelected);

  Polyanno.L.map.addLayer(Polyanno.L.iiifLayer);
  Polyanno.L.map.addLayer(Polyanno.L.suggestedParentVector);
  Polyanno.L.map.addLayer(Polyanno.L.vectors);

  Polyanno.L.drawControl.default.addTo(Polyanno.L.map);

  Polyanno.L.map.whenReady(function(){
    mapset = true;
    polyanno_annos_of_target(imageSelected, "vector", polyanno_load_existing_vectors);
    Polyanno.L.vec_event.created();
    Polyanno.L.vec_event.click();
    Polyanno.L.vec_event.edit();
    Polyanno.L.vec_event.delete();
    Polyanno.buildingParents.btn_events();
    Polyanno.L.map_event();
  });
};

//*****

Polyanno.L.map_event = function() {

  var isInside = function(vertex, bounds) {
    var x = vertex[0];
    var y = vertex[1];
    //
  };

  Polyanno.L.map.on( 'zoomend', function(event) {
    alert("so now the coords are "+JSON.stringify(Polyanno.L.map.getBounds()));
  });
  Polyanno.L.map.on( 'moveend', function(event) {
    
  });
};


Polyanno.L.vec_event.created = function() {

  Polyanno.L.map.on(L.Draw.Event.CREATED, function(evt) {

    var layer = evt.layer;

    if (Polyanno.connectingEquals.status)   {      ///drawing a new vector for a smaller text fragment
      polyanno_linking_annos_to_vector_checks(layer);
    }
    else {

      var shape = layer.toGeoJSON();
      //[number, overlap_array, parent_array, children_array]
      //where number: 0 = no overlap, 1 = overlap, 2 = new shape is a child, 3 = new shape is a parent
      var checkingOverlapping = check_this_shape_for_overlapping(shape, Polyanno.L.vectors, false, true, true);

      Polyanno.L.vectors.addLayer(layer);

      //if there is intersecting overlap
      if (checkingOverlapping[0] == 1) {  
        Polyanno.L.vectors.removeLayer(layer);
        var mapCentre = Polyanno.L.map.getCenter();
        Polyanno.L.menu.overlaps.setLatLng(mapCentre).openOn(Polyanno.L.map);
        setTimeout(function(){
          Polyanno.L.map.closePopup();
        }, 2000);
      }

      //if new shape is entirely inside another
      else if (checkingOverlapping[0] == 2)  {   
        Polyanno.L.vectors.removeLayer(layer);

        Polyanno.selected.reset();
        var parentLayer = checkingOverlapping[2][0];
        Polyanno.selected.vectors.add(Polyanno.vectors.getById(parentLayer._leaflet_id));
        var transcriptions_ids = polyanno_annos_of_target(parentLayer._leaflet_id, "transcription");
        var translations_ids = polyanno_annos_of_target(parentLayer._leaflet_id, "translation");
        if (transcriptions_ids.length != 0) { Polyanno.selected.transcriptions.add(transcriptions_ids[0]);  };
        if (translations_ids.length != 0) { Polyanno.selected.translations.add(translations_ids[0]); };

        var popLtLngs = parentLayer.getBounds().getCenter();
        Polyanno.L.menu.isChild.setLatLng(popLtLngs).openOn(Polyanno.L.map);
        setTimeout(function(){
          parentLayer.openPopup();
        }, 2000);
      }

      //if new shape contains another entirely
      else if (checkingOverlapping[0] == 3)  { 
        var popLtLngs = layer.getBounds().getCenter();  
        Polyanno.L.vectors.removeLayer(layer);
        for (var t=0; t < checkingOverlapping[3].length; t++) {
          checkingOverlapping[3][t].setStyle({color: Polyanno.colours.processing.vector});
        };
        Polyanno.L.menu.isParent.setLatLng(popLtLngs).openOn(Polyanno.L.map);
        $("#polyanno-merge-shapes-enable").removeClass("btn-default").addClass("btn-warning", 500);
        setTimeout(function(){
          Polyanno.L.map.closePopup();
        }, 2000);
        setTimeout(function(){
          $("#polyanno-merge-shapes-enable").removeClass("btn-warning").addClass("btn-default", 500);
          for (var t=0; t < checkingOverlapping[3].length; t++) {
            checkingOverlapping[3][t].setStyle({color: Polyanno.colours.default.vector});
          };
        }, 4000);
        
      }

      //if there is no overlap with other shapes
      else {
        //var concavity_check = check_for_concavity(shape.geometry.coordinates[0]);

        polyanno_new_vector_made(layer, shape);
      }; ///*************
    };

  });
};

Polyanno.L.vec_event.click = function() {

  Polyanno.L.vectors.on('click', function(vec) {

    //reset Selected
    Polyanno.selected.reset();

    //set Selected
    Polyanno.selected.setVector(vec);

    if (Polyanno.selected.currentlyEditing || Polyanno.selected.currentlyDeleting) {}
    else if (Polyanno.connectingEquals.status) {    }
    else if (Polyanno.buildingParents.status) {  Polyanno.buildingParents.clicked(vec);  }
    else {  vec.layer.openPopup();  };

  });

};

Polyanno.L.vec_event.edit = function() {

  Polyanno.L.map.on(L.Draw.Event.EDITSTART, function(){
    Polyanno.selected.currentlyEditing = true;
  });

  Polyanno.L.map.on(L.Draw.Event.EDITVERTEX, function(layers){

    ///eventually use ghosting and checking but for now

    layers.eachLayer(function (vec) {

      var shape = vec.layer.toGeoJSON();
      var v = Polyanno.vectors.getById(vec.layer._leaflet_id);
      v.update({coordinates: shape.geometry.coordinates[0]});

    });

  });
};

Polyanno.L.vec_event.delete = function() {

  Polyanno.L.map.on(L.Draw.Event.DELETESTART, function(){
    Polyanno.selected.currentlyDeleting = true;
  });

  Polyanno.L.map.on(L.Draw.Event.DELETED, function(){

    if (Polyanno.vectors.array.length == 0) {
      $("#polyanno-merge-shapes-enable").addClass("disabled").prop('disabled', true);
    };

  });

};















////alltheunicode

$('#polyanno-page-body').on("click", '.newAnnotation', function(event) {

  atu_the_input = $(this);
  //change the text input area that the IME conversions are using to this one
  atu_initialise_IMEs($(this));

});

$("#polyanno-top-bar").on("click", ".polyanno-add-keyboard", function(event){
    var dragon_opts = {
      "minimise": true,
      "initialise_min_bar": false
    };
    /////return when fixed
    //addKeyboard(dragon_opts, false); 
});

////////custom keys

var atu_blank_custom_keyboard_HTML = `
  <div class="col-md-6">
    <div class="row">
      <span >Keyboard Name:</span>
      <textarea id="atu-custom-keyboard-name" style="height: 20px; width: 70%; background-color: buttonface; opacity: 0.5; border-style: hidden;"></textarea>
    </div>
    <div id="atu-custom-keyboard-keys" class="row ui-droppable atu-keyboard-droppable" style="height: 100px; background-color: yellow; border: 5px dotted grey;">

    </div>
    <div class="row">
      <button id="atu-custom-keyboard-save" style="width: 100%;">
        Save
      </button>
    </div>
  </div>
`;

var atu_custom_keyboard_HTML = `
  <div class="row">
    <div id="newKeyboardForCloning" class="col-md-6 atu-cloning-keyboard">`
    + atu_main_HTML +`
    </div>`
    +atu_blank_custom_keyboard_HTML+`
  </div>
`;

var atu_custom_keyboard_handlebar_HTML = `
  
`;

var polyanno_disable_keyboards = function() {
  $(".polyanno-add-keyboard").addClass("disabled").prop('disabled', true);
  $(".polyanno-add-ime").addClass("disabled").prop('disabled', true);
  $(".polyanno-discussion-btn").addClass("disabled").prop('disabled', true);
  $(".atu-custom-keyboard-btn").addClass("disabled").prop('disabled', true);
};

var polyanno_enable_keyboards = function() {
  $(".polyanno-add-keyboard").removeClass("disabled").prop('disabled', false);
  $(".polyanno-add-ime").removeClass("disabled").prop('disabled', false);
  $(".polyanno-discussion-btn").removeClass("disabled").prop('disabled', false);
  $(".atu-custom-keyboard-btn").removeClass("disabled").prop('disabled', false);
};

var atu_custom_keyboards = [];

var polyanno_keyboard_cursor_move = function() {
  var cl = $(".polyanno_outer_merging_cursor").clone();
  cl.attr("id", "polyanno_merging_cursor");
  $("#newKeyboardForCloning").append(cl);
  $("#polyanno_merging_cursor").css({left:e.pageX - 50, top:e.pageY + 50});
  ///disappear whilst the cursor is clicking and actually dragging and dropping
};

var createCustomKeyboard = function() {

  var atu_custom_keyboard_box_id = add_dragondrop_pop("boop", atu_custom_keyboard_HTML, $(".atu-keyboard-parent").attr("id"), false,  atu_custom_keyboard_handlebar_HTML);
  $(atu_custom_keyboard_box_id)
  .toggle()
  .removeClass(function (index, className) {
      return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
  }).addClass("col-md-12");

  if (!atu_has_setup_initialised) { atu_initialise_setup(); };

  new_body_id = Math.random().toString().substring(2);
  $("#newKeyboardForCloning").find(".atu-mapPopupBody").attr("id", new_body_id);

  var total_width = $("#newKeyboardForCloning").find(".atu-mapPopupBody").css("width");
  var key_width = parseInt(total_width / 16);
  var keys = $("#newKeyboardForCloning").find(".c");
  keys[0].onclick = null;

  $("#newKeyboardForCloning").find(".sameWidth")
  .css("cursor", "grab")
  .css("opacity", 0.5);

  var cl = $(".polyanno_outer_merging_cursor").clone();
  cl.attr("id", "polyanno_merging_cursor");
  $("#newKeyboardForCloning").append(cl);

  $("#newKeyboardForCloning").on("mousemove", function(e) {
    $("#polyanno_merging_cursor").css({left:e.pageX - 50, top:e.pageY - 50});
  });

  $("#newKeyboardForCloning").on("mousenter", ".sameWidth", function(event) {
    $(event.target).css("opacity", 1.0);
    $(event.target).animate(
      {  top: "+=5px"  }, 
      {  duration: 400  }
    );
  });
  $("#newKeyboardForCloning").on("mouseleave", ".sameWidth", function(event) {
    $(event.target).css("opacity", 0.5);
    $(event.target).animate(
      {  top: "-=5px"  }, 
      {  duration: 400  }
    );
  });

  $("#newKeyboardForCloning").find(".sameWidth").draggable({
    revert: true,
    helper: function() {
      var container = $('<div/>');
      var clonedKey = $(this).clone().css("opacity", 0.7);
      container.append(clonedKey);
      return container;
    }
  });

  $( ".atu-keyboard-droppable" ).droppable({
      drop: function( event, ui ) {
        var thisKey = $(ui.helper.children());
        var keyCodePoint = thisKey.attr("data-codepoint");
        var onclicked = "clicked(" + keyCodePoint + ")";
        thisKey[0].onclick = onclicked;
        $( this ).append(thisKey);
        thisKey.css("opacity", 1.0)
        .css("background-color", "white");
      }
  });

  ////!!!resulting in not able to find by id and get children...?
  //buildMap(new_body_id, '0000', null, false); 

  ///on save button save new keyboard
  ///load list in popover from * button

  var atu_custom_keyboards_list = {};

  $("#atu-custom-keyboard-save").on("click", function(event) {
    if (atu_custom_keyboards_list == {}) {
      $(".atu-display-custom-keyboards-btn").removeClass("disabled").prop('disabled', false);
    };
    var n = $("#atu-custom-keyboard-name").val();
    atu_custom_keyboards_list[n] = [];
    for (var i=0; i < $("#atu-custom-keyboard-keys").length; i++) {
      var keyDOM = document.getElementById("atu-custom-keyboard-keys").children[i];
      atu_custom_keyboards_list[n].push(keyDOM);
    };
    $("#atu-custom-keyboard-keys").html(" ");
    $(atu_custom_keyboard_box_id).toggle();
    var nameHTML = "";
    for (names in atu_custom_keyboards_list) {
      nameHTML.concat("<li>"+names+"</li>");
    };
    var popHTML = "<ul id='atu-display-custom-keyboards'>"+nameHTML+"</ul>";
    $(".atu-display-custom-keyboards-btn").removeClass("disabled").prop('disabled', false);
    var popover = $(".atu-display-custom-keyboards-btn").data('bs.popover');
    popover.options.content = popHTML;
  });

  $(".atu-custom-keyboard-new-btn").on("click", function(event){
    $(atu_custom_keyboard_box_id).toggle();
  });

  ////improve display as currently of zero height etc??
  $(".atu-display-custom-keyboards-btn").popover({
    html : true,
    placement: "auto bottom",
    content: "<ul id='atu-display-custom-keyboards'></ul>"
  });

  ///generate new custom map with up to 

};








////INITIALISING AND SETUPS



/////////////

Polyanno.starting.storage_fields = function(opts) {
  Polyanno.urls = {
    "vector": websiteAddress.concat("/api/vectors/"),
    "transcription": websiteAddress.concat("/api/transcriptions/"),
    "translation": websiteAddress.concat("/api/translations/"),
    "annotation": websiteAddress.concat("/api/annotations/")
  };
  if (!isUseless(opts)) {
    if (!isUseless(opts.transcription)) { Polyanno.urls.transcription = opts.transcription; };
    if (!isUseless(opts.translation)) { Polyanno.urls.translation = opts.translation; };
    if (!isUseless(opts.vector)) { Polyanno.urls.vector = opts.vector; };
    if (!isUseless(opts.annotation)) { Polyanno.urls.annotation = opts.annotation; };
  };
};

Polyanno.starting.storage = function(opts) {
  
  if ( (!isUseless(opts)) && (!isUseless(opts.base_url)) ) {
    websiteAddress = opts.base_url;
    Polyanno.starting.storage_fields(opts);
  }
  else {
    websiteAddress = "http://"+window.location.host;
    Polyanno.starting.storage_fields(opts);
  };

};

Polyanno.starting.voting = function() {

  $('#polyanno-page-body').on("click", '.polyannoVotingUpButton', function(event) {
    var votedID = $(event.target).closest(".polyanno-voting-overlay").prev().attr("id");
    var currentTopText = $(event.target).closest(".textEditorPopup").find(".polyanno-top-voted").find("p").html();
    var thisEditorID = $(event.target).closest(".textEditorPopup").attr("id");
    var thisEditor = Polyanno.editors.getById(thisEditorID);
    thisEditor.setSelected();

    votingFunction("up", votedID, thisEditor);

  });
};

Polyanno.starting.editor_events = function() {
  var the_tags_html = "<div class='row'>";
  $('.polyanno-image-metadata-tags-btn').on("click", function(event){
    var tagHTML1 = "<a class='polyanno-tag' >";
    var tagHTML2 = "</a>";
    if (!isUseless(imageSelectedMetadata)) {
      var polyanno_searching = $.grep(imageSelectedMetadata, function(e){ 
          if (!isUseless(e.label)) {  return e.label == "Tag";   };
      });
      polyanno_searching.forEach(function(theTagSpan){
        var polyannoTagHTML = tagHTML1 + theTagSpan + tagHTML2;
        the_tags_html.concat(polyannoTagHTML);
      });
    };
    the_tags_html.concat("</div>");
    add_dragondrop_pop("polyanno-image-tags-pop", the_tags_html, "polyanno-page-body", true);
  });

  $('#polyanno-page-body').on("click", '.addAnnotationSubmit', function(event) {
    var thisEditorID = $(event.target).closest(".annoPopup").attr("id"); 
    var thisEditor = Polyanno.editors.getById(thisEditorID);
    thisEditor.setSelected();
    Polyanno.selected.textBox.new(thisEditor);
  });

  $('#polyanno-page-body').on("click", ".closePopoverMenuBtn", function(){
    $(event.target).closest(".popover").popover("hide"); ///////
  });

  $('#polyanno-page-body').on("click", ".polyanno-add-new-toggle-row", function(event){
    var this_add_new_row = $(this).closest(".textEditorPopup").find(".polyanno-add-new-row");
    if (this_add_new_row.css("display") == "none") {
      this_add_new_row.css("display", "block");
    }
    else {
      this_add_new_row.css("display", "none");
    };
  });

  $('#polyanno-page-body').on("click", ".polyanno-alternatives-toggle-row", function(event){
    var this_alternatives_row = $(this).closest(".textEditorPopup").find(".polyanno-list-alternatives-row");
    if (this_alternatives_row.css("display") == "none") {
      this_alternatives_row.css("display", "block");
    }
    else {
      this_alternatives_row.css("display", "none");
    };
  });

  $('#polyanno-page-body').on("click", ".polyannoLinkVectorBtn", function(){
    var thisEditorID = $(event.target).closest(".textEditorPopup").attr("id"); 
    var thisEditor = Polyanno.editors.getById(thisEditorID);
    thisEditor.setSelected();
    var parent_anno = Polyanno.transcriptions.getById(Polyanno.selected.transcriptions.array[0].parent.id);
    var parent_vector_id = checkForVectorTarget(null);
    var the_parent_vector = Polyanno.L.vectors.getLayer(parent_vector_id);
    Polyanno.connectingEquals = {
      status: true,
      siblings: Polyanno.selected.transcriptions.array,
      parent_anno : Polyanno.selected.transcriptions.array[0].parent,
      parent_vector : the_parent_vector
    };
  
    Polyanno.colours.highlightThis.vector(parent_vector_id, Polyanno.colours.processing.vector);

    ///need to enable some kind of cancelling option, preferably within Leaflet itself

  });

  $("#polyanno-page-body").on("click", ".polyanno-options-dropdown-toggle", function(event){
      var theOptionRows = $(this).closest(".textEditorPopup").find(".polyanno-options-row");
      var theHandlebar = $(this).closest(".textEditorPopup").find(".popupBoxHandlebar");
      if (theOptionRows.css("display") == "none") {
        theOptionRows.css("display", "block");
        theHandlebar.css("border-radius", "5px 5px 0px 0px");
      }
      else {
        theOptionRows.css("display", "none");
        theHandlebar.css("border-radius", "5px");
      };
  });

  $("#polyanno-page-body").on("click", ".polyanno-metadata-tags-btn", function(event){
      var theTagsRow = $(this).closest(".textEditorPopup").find(".polyanno-metadata-tags-row");
      if (theTagsRow.css("display") == "none") {
        theTagsRow.css("display", "block");
      }
      else {
        theTagsRow.css("display", "none");
      };
  });

};



var polyanno_setup = function(opts) {

  if (opts.minimising == false) {  polyanno_minimising = false;  };

  document.getElementById("polyanno-top-bar").innerHTML = polyanno_top_bar_HTML;
  if (document.getElementById("polyanno-top-bar").innerHTML == polyanno_top_bar_HTML) {
    addIMEs(true, true, true);
  };

  ///this is currently compulsory and synchronous but should use a local storage in parallel soon too like Leaflet Draw?
  Polyanno.starting.storage(opts.storage);

  if (!isUseless(opts.editor_options)) {  polyannoEditorHTML_options = polyannoEditorHTML_options_partone + opts.editor_options + polyannoEditorHTML_options_parttwo; };

  //var polyanno_image_title = Polyanno.image.findTitle(imageSelectedMetadata);
  var polyanno_image_title_HTML = "<span class='glyphicon glyphicon-picture'></span>";//"<span>"+polyanno_image_title()+"</span>";

  //will this induce synchronicity problems?
  $("#polyanno-page-body").addClass("row atu-keyboard-parent");

  //createCustomKeyboard();

  var image_viewer_id = add_dragondrop_pop( "polyanno-image-box", polyanno_image_viewer_HTML , "polyanno-page-body", polyanno_minimising, polyanno_image_title_HTML, true );
  $(image_viewer_id)
  .removeClass(function (index, className) {
      return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
  })
  .addClass("col-md-8")
  .resizable( "option", "handles", {"e": ".dragondrop-resize-e", "w": ".dragondrop-resize-w", "s": ".polyanno-resize-s" } )
  .attr("id", "imageViewer");

  Polyanno.starting.leaflet();

  if (!isUseless(opts.highlighting)) {  Polyanno.starting.highlighting();  };

  initialise_dragondrop("polyanno-page-body", {"minimise": polyanno_minimising });

  Polyanno.starting.editor_events();

  Polyanno.starting.voting();


  $(".atu-custom-keyboard-buttons").toggle();
  $(".atu-custom-keyboard-btn").on("click", function(event){
    $(".atu-custom-keyboard-buttons").toggle("swing");
  });

  window.hypothesisConfig = function () {
    return {
      "showHighlights": false
    };

    /////login to Hypothesis

  };

};

Polyanno.setup = function(opts) {
  polyanno_setup(opts);
};

