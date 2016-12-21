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
  txt += '<thead><tr><th width="220">Non-Terminal Symbol</th><th>' + htitle + '</th></thead></thead>';

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
  var txt = '<div><strong>Rule Set</strong></div><div class="space-v-8"></div>';

  txt += '<table>';
  txt += '<thead><tr><th width="60">#</th><th>Rule</th></thead></thead>';

  for(var i=1; i<data.rule.length; i++) {
    txt += '<tr>';
    txt += '<td>' + i + '</td>';
    txt += '<td>' + data.rule[i].first + ' -> ' + data.rule[i].imply.join(' ') + '</td>';
    txt += '</tr>'
  }

  txt += '</table>';
  txt += '<div><strong>Parsing Table</strong></div><div class="space-v-8"></div>';
  txt += '<div class="table-scroll"><table>';

  var cleanNumber = function(num) {
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

  txt += '</table></div>'

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

$(function() {

  $(document).foundation();

  $('.example-selector').change(function() {
    var value = $('.example-selector').val();
    if (value === '-') return;
    $('#grammar-input').val(example[value]);
    $('#tokens-input').val(example[value+'_token']);
  });

  console.log(func);

  $('.calculate-btn').click(calculateGrammar);
  $('.scan-btn').click(function() {
    var calStatus = calculateGrammar();
    if(calStatus !== 0) {
      $('.scan-alert').show().text('Please correct grammar before.');
      return ;
    }

    $('.scan-alert').hide();

    var grammar = $('#grammar-input').val();
    var tokens = $('#tokens-input').val();
    var ruleData = func.parseToRule(grammar);
    var parsingTable = func.parsingTable(ruleData);

    try {
      var output = func.scanner(tokens, parsingTable);

      $('.scan-result').text(JSON.stringify(output));
    } catch(e) {
      $('.scan-alert').show().text('Error : ' + e);
    }
  })
});
