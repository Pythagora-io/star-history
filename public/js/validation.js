function validateUrl(value) {
  var pattern = /^(https?:\/\/)?(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+$/;
  return pattern.test(value);
}