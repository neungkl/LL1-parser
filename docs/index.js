var func = window.func;

var example = {
  catfish: [
    'S -> A | B',
    'A -> cat | dog',
    'B -> bird | fish'
  ].join('\n'),
  parentheses: [
    'S -> F | ( S + S )',
    'F -> a'
  ].join('\n'),
  number: [
    'S -> NON_ZERO OTHER_DIGIT',
    'OTHER_DIGIT -> ALL_NUM OTHER_DIGIT | LAMBDA',
    'ALL_NUM -> 0 | NON_ZERO',
    'NON_ZERO -> 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9'
  ].join('\n'),
  catfish_token: 'cat',
  parentheses_token: '( ( a + a ) + a )',
  number_token: '1 2 6 0 1 7'
};

var JSONtoTable = function(json, htitle) {

  var txt = '<table>';
  txt += '<thead><tr><th class="table-title-width">Non-Terminal Symbol</th><th>' + htitle + '</th></thead></thead>';

  for (var prop in json) {
    txt += '<tr>';
    txt += '<td>' + prop + '</td>';
    txt += '<td>' + json[prop].map(function(x) {
      return x === func.lambda ? '&#955;' : x;
    }).join(', ') + '</td>';
    txt += '</tr>';
  }

  return txt + '</table>';
}

var parsingTableInfo = function(data) {
  var txt = '<div>'

  txt += '<div><strong>Parsing Table</strong></div><div class="space-v-8"></div>';
  txt += '<div class="table-scroll"><table>';

  var cleanNumber = function(num) {
    if($.isArray(num)) {
      $('.input-alert').show().text(
        'Error : This LL1 grammar is incorrect. '+
        'Shouldn\'t have more than 1 rule in single cell in Parsing Table.'
      );
      $('a[href="#parsing-table-info"]').click();

      return '<div style="color:red">' + num.join(', ') + '</div>';
    }
    if(num >= data.rule.length) return '-';
    return num;
  }

  for(var i=0; i<data.table.length; i++) {
    txt += '<tr>';
    for(var j=0; j<data.table[i].length; j++) {
      txt += '<td>';
      txt += i + j == 0 ? '#' : cleanNumber(data.table[i][j]);
      txt += '</td>';
    }
    txt += '</tr>';
  }

  txt += '</table></div>';

  txt += '</div>';

  txt += '<strong>Rule Set</strong></div><div class="space-v-8"></div>';
  txt += '<table>';
  txt += '<thead><tr><th width="60">#</th><th>Rule</th></thead></thead>';

  for(var i=1; i<data.rule.length; i++) {
    txt += '<tr>';
    txt += '<td>' + i + '</td>';
    txt += '<td>' + data.rule[i].first + ' -> ' + data.rule[i].imply.join(' ') + '</td>';
    txt += '</tr>'
  }

  txt += '</table>';

  return txt;
}

var calculateGrammar = function() {
  var grammar = $('#grammar-input').val();

  if ($.trim(grammar) === '') {
    $('.input-alert').show().text('Please enter the input');
    return ;
  }

  try {

    $('.input-alert').hide();

    var ruleData = func.parseToRule(grammar);
    var firstSet = func.firstSet(ruleData);
    var followSet = func.followSet(ruleData, firstSet);
    var parsingTable = func.parsingTable(ruleData, firstSet, followSet);

    $('#first-set-info').html(JSONtoTable(firstSet, 'First Set'));
    $('#follow-set-info').html(JSONtoTable(followSet, 'Follow Set'));
    $('#parsing-table-info').html(parsingTableInfo(parsingTable));

    return 0;
  } catch(e) {
    $('.input-alert').show().text('Error : ' + e);
  }

  return 1;
}

var scanErr = function(txt) {
  $('.scan-alert').show().html(txt);
}

var cleanTree = function(json) {
  return '<div>' + JSON.stringify(json, null, '\t')
    .split('\n')
    .filter(function(x) { return x.indexOf('{') === -1 && x.indexOf('}') === -1; })
    .map(function(x) {
      return x.replace(
        /".+"/g,
        function(y) { return '<span style="color:#1074ac;">' + y + '</span>'; }
      );
    })
    .join('<br>')
    .replace(/\t\t/g, '\t')
    .replace(/\t/g,'<span class="tab">&nbsp;</span>') + '</div>';
}

var cleanLog = function(log) {
  return '<table><thead><tr><th>Type</th><th>Detail</th></tr></thead>' +
  log.map(function(x) {
    var y = x.replace('λ', '&#955;').split(':');
    return '<tr><td>' + y[0] + '</td><td>' + y[1] + '</td></tr>';
  }).join('')
  + '</table>';
}

$(function() {

  $(document).foundation();

  $('.example-selector').change(function() {
    var value = $('.example-selector').val();
    if (value === '-') return;
    $('#grammar-input').val(example[value]);
    $('#tokens-input').val(example[value+'_token']);
  });

  $('.calculate-btn').click(calculateGrammar);
  $('.scan-btn').click(function() {
    var calStatus = calculateGrammar();
    if(calStatus !== 0) {
      scanErr('Please correct above Grammar before.');
      return ;
    }

    $('.scan-alert').hide();

    var grammar = $('#grammar-input').val();
    var tokens = $('#tokens-input').val();

    if($.trim(tokens).length === 0) {
      scanErr('Please enter token string');
      return ;
    }

    var ruleData = func.parseToRule(grammar);
    var parsingTable = func.parsingTable(ruleData);

    try {
      var output = func.scanner(tokens, parsingTable);

      switch(output.status) {
        case 'TOKEN_EXCEED' :
          scanErr(
            'Your token is longer appropriate length.<br>'+
            'Error : TOKEN_EXCEED'
          );
          break;
        case 'TOKEN_NOT_MATCH' :
          scanErr(
            'Your token not match the grammar symbol.<br>'+
            'Error : TOKEN_NOT_MATCH'
          );
          break;
        case 'TOKEN_NOT_MATCH_TERMINATE' :
          scanErr(
            'Your token not match to terminal-symbol in grammar rule.<br>'+
            'Error : TOKEN_NOT_MATCH_TERMINATE'
          );
          break;
        case 'SCAN_ERROR' :
          scanErr(
            'Token syntax not match with the rule.<br>'+
            'Error : SCAN_ERROR'
          );
          break;
        case 'POP_ERROR' :
          scanErr(
            'Some token are appear too fast.<br>'+
            'Error : POP_ERROR'
          );
          break;
        case 'STACK_OVERFLOW' :
          scanErr(
            'The token is too long for parsing.<br>'+
            'Error : STACK_OVERFLOW'
          );
          break;
        case 'NOT_LL1' :
          scanErr(
            'The Grammar above is not LL1 format.<br>'+
            'Error : NOT_LL1'
          );
          break;
      }

      if(output.status === 'PASS') {
        $('#logs-info .result').html(cleanLog(output.log));
        $('#grammar-tree-info').html(cleanTree(output.parsingTree));
      }
    } catch(e) {
      scanErr('Error : ' + e);
    }
  })
});
