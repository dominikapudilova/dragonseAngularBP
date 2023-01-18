import {
  faCircleXmark,
  faFireFlameCurved,
  faLeaf,
  faMars,
  faTint,
  faVenus,
  faWind
} from "@fortawesome/free-solid-svg-icons";

export class Utils {


  public static getGenderIcon(gender: number) {
    if (gender > 0) {
      return faMars;
    }
    return faVenus;
  }

  public static getGenderTitle(gender: number) {
    if (gender > 0) {
      return "male";
    }
    return "female";
  }

  public static getElementIcon(name: string) {
    switch (name) {
      case "fire":
        return faFireFlameCurved;
      case "water":
        return faTint;
      case "air":
        return faWind;
      case "earth":
        return faLeaf;
      default:
        return faCircleXmark;
    }
  }

}
