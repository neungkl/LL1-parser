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
  ].join('\n')
}

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
  var txt = '<div><strong>Rule Set</strong></div>';

  txt += '<div><strong>Parsing Table</strong></div>';

  txt += '<div class="table-scroll"><table>';



  txt += '</table></div>'

  return txt;
}

$(function() {

  $(document).foundation();

  $('.example-selector').change(function() {
    var value = $('.example-selector').val();
    if (value === '-') return;
    $('#grammar-input').val(example[value]);
  });

  console.log(func);

  $('.calculate-btn').click(function() {
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

    } catch(e) {
      $('.input-alert').show().text('Error : ' + e);
    }

    console.log(firstSet, followSet, parsingTable);

  });
});
