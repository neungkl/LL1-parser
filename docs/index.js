console.log(window.func);

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
  $('.example-selector').change(function() {
    var value = $('.example-selector').val();
    if(value === '-') return ;
    console.log(value, example[value]);
    $('#grammar-input').val(example[value]);
  });
});
