{pkgs}: {
  deps = [
    pkgs.unixtools.netstat
    pkgs.lsof
    pkgs.nodejs
    pkgs.nodePackages.typescript-language-server
    pkgs.postgresql
  ];
}
