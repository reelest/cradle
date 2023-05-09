export default function formatPhoneNumber(number_string) {
  const [failed, countryCode, ...parts] = number_string.split(
    /^(\+\d\d\d)?(\d\d\d)?(?:(\d\d\d)?(\d\d\d)?|(\d?\d\d\d)?(\d\d\d)?)(\d\d\d\d?)?$/
  );
  if (failed.length) return failed;
  return (
    (countryCode ? countryCode + " " : "") + parts.filter(Boolean).join("-")
  );
}
