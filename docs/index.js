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

$(function() {

  $(document).foundation();

  $('.example-selector').change(function() {
    var value = $('.example-selector').val();
    if(value === '-') return ;
    console.log(value, example[value]);
    $('#grammar-input').val(example[value]);
  });

  console.log(func);

  $('.calculate-btn').click(function() {
    var grammar = $('#grammar-input').val();

    // TODO : Add try-catch for inifinite loop

    var ruleData = func.parseToRule(grammar);
    var firstSet = func.firstSet(ruleData);
    var followSet = func.followSet(ruleData, firstSet);
    var parsingTable = func.parsingTable(ruleData, firstSet, followSet);

    $('#first-set-info').text(JSON.stringify(firstSet));
    $('#follow-set-info').text(JSON.stringify(followSet));
    $('#parsing-table-info').text(JSON.stringify(parsingTable));

    console.log(firstSet, followSet, parsingTable);

  });
});
