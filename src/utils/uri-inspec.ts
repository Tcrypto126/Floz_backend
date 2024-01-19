import { chalkWarning, chalkInfo } from "../tools/chalk";

type objectReturn = {
  source: string;
  dataBaseName: string;
};

const uriInspec = (uri: string): objectReturn => {
  const source =
    uri.split(":")[0] === "mongodb+srv"
      ? chalkWarning("Atlas")
      : chalkInfo("LocalHost");
  const dataBaseName = uri.split("/")[3];

  return { source, dataBaseName };
};

export default uriInspec;
