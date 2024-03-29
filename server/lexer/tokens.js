export const TokensList = {
  Identifier: "Identifier",
  Number: "Number",
  Boolean: "Boolean",
  Float: "Float",
  String: "String",
  Character: "Character",

  "//": "Comment_Single",
  Comment_Single_Content: "Comment_Single_Content",

  "/*": "Comment_Multiline_Start",
  "*/": "Comment_Multiline_End",
  Comment_Multi_Content: "Comment_Multi_Content",

  "+": "Arithmetic_Addition",
  "-": "Arithmetic_Subtraction",
  "*": "Arithmetic_Multiplication",
  "/": "Arithmetic_Division",
  "%": "Arithmetic_Modulo",
  "^": "Arithmetic_Exponent",

  "==": "Comparison_Equal",
  "!=": "Comparison_NotEqual",
  "<": "Comparison_LessThan",
  ">": "Comparison_GreaterThan",
  "<=": "Comparison_LessThanOrEqual",
  ">=": "Comparison_GreaterThanOrEqual",

  "&&": "Logical_And",
  "||": "Logical_Or",
  "!": "Logical_Not",

  "=": "Assignment_Assign",
  "+=": "Assignment_AddAssign",
  "-=": "Assignment_SubtractAssign",
  "*=": "Assignment_MultiplyAssign",
  "/=": "Assignment_DivideAssign",
  "%=": "Assignment_ModuloAssign",
  "^=": "Assignment_ExponentAssign",

  "++": "Increment",
  "--": "Decrement",
  ">>": "StepWiseIncrement",
  "<<": "StepWiseDecrement",

  "?": "SpecialKey_QuestionMark",
  ":": "Delimiter_Colon",

  "[": "Delimiter_OpenBracket",
  "]": "Delimiter_CloseBracket",

  "(": "Delimiter_OpenParenthesis",
  ")": "Delimiter_CloseParenthesis",

  "{": "Delimiter_OpenBrace",
  "}": "Delimiter_CloseBrace",

  ",": "Delimiter_Comma",
  ";": "Delimiter_Semicolon",

  "#": "SpecialKey_UndefinedSafety",
  "'": "SpecialKey_SingleQuote",
  '"': "SpecialKey_DoubleQuote",
  "`": "SpecialKey_Backtick",
  ".": "SpecialKey_Dot",
  $: "SpecialKey_Dollar",
  "@": "SpecialKey_At",

  "\\": "Escape_Sequence",
  "\\n": "Escape_NewLine",
  '\\"': "Escape_DoubleQuote",
  "\\'": "Escape_SingleQuote",
  // Variable/Constants

  lit: "Variable_Lit",
  fire: "Constant_Fire",

  // Conditionals

  yeet: "Conditional_Yeet",
  yas: "Conditional_Yas",
  yikes: "Conditional_Yikes",

  // Looping

  relapse: "Looping_Relapse",
  as: "Looping_As",
  worse: "Looping_Worse",
  recover: "Looping_Recover",
  periodt: "Looping_Periodt",
  swerve: "Looping_Swerve",

  // Exception Handling

  sus: "Exception_Handling_Sus",
  dead: "Exception_Handling_Dead",
  gotcha: "Exception_Handling_Gotcha",
  slay: "Exception_Handling_Slay",

  // Simplified Callback Function

  delay: "CB_Function_Delay",
  chill: "CB_Function_Chill",

  // Boolean

  real: "Boolean_Real",
  cap: "Boolean_Cap",

  // Types

  fig: "Type_Int",
  figure: "Type_Int",
  yarn: "Type_String",
  char: "Type_Char",
  character: "Type_Char",
  characters: "Type_Char",
  fuzzy: "Type_Decimal",
  ghosted: "Type_Null",
  tea: "Type_Boolean",

  // Reserved Words

  flex: "Reserved_Flex",
  spill: "Reserved_Spill",

  // Routine Reserved Words

  routine: "Reserved_Function",
  bounce: "Reserved_Return",

  // Function Contractor

  bet: "Contractor_Bet",

  // HTML

  htmlize: "HTML_Instance",
  body: "HTML_Body",
  h1: "HTML_Header1",
  h2: "HTML_Header2",
  h3: "HTML_Header3",
  h4: "HTML_Header4",
  h5: "HTML_Header5",
  h6: "HTML_Header6",
  p: "HTML_Paragraph",
  a: "HTML_Link",
  img: "HTML_Image",
  div: "HTML_Div",
  span: "HTML_Span",
  ul: "HTML_UnorderedList",
  ol: "HTML_OrderedList",
  li: "HTML_ListItem",
  br: "HTML_Break",
  hr: "HTML_HorizontalRule",
  em: "HTML_Emphasis",
  strong: "HTML_Strong",
  blockquote: "HTML_Blockquote",
  cite: "HTML_Citation",
  code: "HTML_Code",
  pre: "HTML_Preformatted",
  i: "HTML_Italic",
  b: "HTML_Bold",
  u: "HTML_Underline",
  small: "HTML_Small",
  sub: "HTML_Subscript",
  sup: "HTML_Superscript",
  abbr: "HTML_Abbreviation",
  address: "HTML_Address",
  var: "HTML_Variable",
  samp: "HTML_Sample",
  header: "HTML_Header",
  nav: "HTML_Navigation",
  main: "HTML_Main",
  section: "HTML_Section",
  article: "HTML_Article",
  aside: "HTML_Aside",
  footer: "HTML_Footer",
  table: "HTML_Table",
  caption: "HTML_Caption",
  colgroup: "HTML_ColumnGroup",
  col: "HTML_Column",
  thead: "HTML_TableHead",
  tbody: "HTML_TableBody",
  tfoot: "HTML_TableFoot",
  tr: "HTML_TableRow",
  th: "HTML_TableHeader",
  td: "HTML_TableData",
  form: "HTML_Form",
  label: "HTML_Label",
  input: "HTML_Input",
  button: "HTML_Button",
  select: "HTML_Select",
  datalist: "HTML_DataList",
  optgroup: "HTML_OptionGroup",
  option: "HTML_Option",
  textarea: "HTML_TextArea",
  output: "HTML_Output",
  progress: "HTML_Progress",
  meter: "HTML_Meter",
  fieldset: "HTML_Fieldset",
  legend: "HTML_Legend",
  details: "HTML_Details",
  summary: "HTML_Summary",
  dialog: "HTML_Dialog",
  script: "HTML_Script",
  noscript: "HTML_NoScript",
  template: "HTML_Template",
  slot: "HTML_Slot",
  canvas: "HTML_Canvas",
  svg: "HTML_Svg",
  math: "HTML_Math",

  // HTML Tag Attributes
  src: "HTML_Attribute_Source",
  alt: "HTML_Attribute_AlternativeText",
  href: "HTML_Attribute_HyperlinkReference",
  style: "HTML_Attribute_Style",
  class: "HTML_Attribute_Class",
  id: "HTML_Attribute_Id",
  width: "HTML_Attribute_Width",
  height: "HTML_Attribute_Height",
  colspan: "HTML_Attribute_ColumnSpan",
  rowspan: "HTML_Attribute_RowSpan",
  type: "HTML_Attribute_Type",
  value: "HTML_Attribute_Value",
  placeholder: "HTML_Attribute_Placeholder",
  checked: "HTML_Attribute_Checked",
  disabled: "HTML_Attribute_Disabled",
  readonly: "HTML_Attribute_ReadOnly",
  required: "HTML_Attribute_Required",
  autofocus: "HTML_Attribute_AutoFocus",
  multiple: "HTML_Attribute_Multiple",
  selected: "HTML_Attribute_Selected",
  name: "HTML_Attribute_Name",
  action: "HTML_Attribute_Action",
  method: "HTML_Attribute_Method",
  enctype: "HTML_Attribute_EncodingType",
  target: "HTML_Attribute_Target",
  rel: "HTML_Attribute_Relation",
  media: "HTML_Attribute_Media",
  alt: "HTML_Attribute_Alternative",
  controls: "HTML_Attribute_Controls",
  loop: "HTML_Attribute_Loop",
  autoplay: "HTML_Attribute_AutoPlay",
  preload: "HTML_Attribute_Preload",
  poster: "HTML_Attribute_Poster",
  frameborder: "HTML_Attribute_FrameBorder",
  scrolling: "HTML_Attribute_Scrolling",
  colspan: "HTML_Attribute_ColumnSpan",
  rowspan: "HTML_Attribute_RowSpan",
  contenteditable: "HTML_Attribute_ContentEditable",
  role: "HTML_Attribute_Role",
  aria: "HTML_Attribute_Aria",
  datetime: "HTML_Attribute_DateTime",
  download: "HTML_Attribute_Download",
  lang: "HTML_Attribute_Language",
  charset: "HTML_Attribute_CharacterSet",
  async: "HTML_Attribute_Async",
  defer: "HTML_Attribute_Defer",
  crossorigin: "HTML_Attribute_CrossOrigin",
  integrity: "HTML_Attribute_Integrity",
  nonce: "HTML_Attribute_Nonce",
  sandbox: "HTML_Attribute_Sandbox",
  allow: "HTML_Attribute_Allow",
  valueasdate: "HTML_Attribute_ValueAsDate",
  valueasnumber: "HTML_Attribute_ValueAsNumber",
  content: "HTML_Attribute_Content",

  END_OF_FILE: "END_OF_FILE"
};

export const reservedWords = [
  TokensList.Identifier,
  TokensList.Number,
  TokensList.Float,
  TokensList.String,
  TokensList.Character,
  TokensList.Comment_Single_Content,
  TokensList.Comment_Multi_Content
];

export const htmlTags = [
  TokensList.htmlize,
  TokensList.body,
  TokensList.h1,
  TokensList.h2,
  TokensList.h3,
  TokensList.h4,
  TokensList.h5,
  TokensList.h6,
  TokensList.p,
  TokensList.a,
  TokensList.img,
  TokensList.div,
  TokensList.span,
  TokensList.ul,
  TokensList.ol,
  TokensList.li,
  TokensList.br,
  TokensList.hr,
  TokensList.em,
  TokensList.strong,
  TokensList.blockquote,
  TokensList.cite,
  TokensList.code,
  TokensList.pre,
  TokensList.i,
  TokensList.b,
  TokensList.u,
  TokensList.small,
  TokensList.sub,
  TokensList.sup,
  TokensList.abbr,
  TokensList.address,
  TokensList.var,
  TokensList.samp,
  TokensList.header,
  TokensList.nav,
  TokensList.main,
  TokensList.section,
  TokensList.article,
  TokensList.aside,
  TokensList.footer,
  TokensList.table,
  TokensList.caption,
  TokensList.colgroup,
  TokensList.col,
  TokensList.thead,
  TokensList.tbody,
  TokensList.tfoot,
  TokensList.tr,
  TokensList.th,
  TokensList.td,
  TokensList.form,
  TokensList.label,
  TokensList.input,
  TokensList.button,
  TokensList.select,
  TokensList.datalist,
  TokensList.optgroup,
  TokensList.option,
  TokensList.textarea,
  TokensList.output,
  TokensList.progress,
  TokensList.meter,
  TokensList.fieldset,
  TokensList.legend,
  TokensList.details,
  TokensList.summary,
  TokensList.dialog,
  TokensList.script,
  TokensList.noscript,
  TokensList.template,
  TokensList.slot,
  TokensList.canvas,
  TokensList.svg,
  TokensList.math
];

export const htmlTagAttributes = [
  TokensList.src,
  TokensList.alt,
  TokensList.href,
  TokensList.style,
  TokensList.class,
  TokensList.id,
  TokensList.width,
  TokensList.height,
  TokensList.colspan,
  TokensList.rowspan,
  TokensList.type,
  TokensList.value,
  TokensList.placeholder,
  TokensList.checked,
  TokensList.disabled,
  TokensList.readonly,
  TokensList.required,
  TokensList.autofocus,
  TokensList.multiple,
  TokensList.selected,
  TokensList.name,
  TokensList.action,
  TokensList.method,
  TokensList.enctype,
  TokensList.target,
  TokensList.rel,
  TokensList.media,
  TokensList.alt,
  TokensList.controls,
  TokensList.loop,
  TokensList.autoplay,
  TokensList.preload,
  TokensList.poster,
  TokensList.frameborder,
  TokensList.scrolling,
  TokensList.colspan,
  TokensList.rowspan,
  TokensList.contenteditable,
  TokensList.role,
  TokensList.aria,
  TokensList.datetime,
  TokensList.download,
  TokensList.lang,
  TokensList.charset,
  TokensList.async,
  TokensList.defer,
  TokensList.crossorigin,
  TokensList.integrity,
  TokensList.nonce,
  TokensList.sandbox,
  TokensList.allow,
  TokensList.valueasdate,
  TokensList.valueasnumber,
  TokensList.content,
  TokensList.tag
];

export const assignmentTokens = [
  TokensList["="],
  TokensList["+="],
  TokensList["-="],
  TokensList["*="],
  TokensList["/="],
  TokensList["%="],
  TokensList["^="]
];
