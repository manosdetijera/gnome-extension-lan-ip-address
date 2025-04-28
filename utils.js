import GLib from 'gi://GLib';

export const getLanIp = () => {       
    // Ask the IP stack what route would be used to reach 1.1.1.1 (Cloudflare DNS)
    // Specifically, what src would be used for the 1st hop?
    const command_output_bytes = GLib.spawn_command_line_sync('ip route')[1];
    const command_output_string = String.fromCharCode.apply(null,  command_output_bytes);

    // Output of the "ip route" command will be a string
    // " ... src 1.2.3.4 ..."
    // So basically we want the next token (word) immediately after the "src"
    // word, and nothing else. This is considerd our LAN IP address.
    const Tun0 = new RegExp(/tun0 proto kernel scope link src [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g);
    const Eth0 = new RegExp(/eth0 proto kernel scope link src [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g);
    const tun0_matches = command_output_string.match(Tun0);
    const eth0_matches = command_output_string.match(Eth0);
    if (tun0_matches) {
        return "tun0: " + tun0_matches[0].split(' ')[6];
    } else if (eth0_matches) {
        return 'eth0: ' + eth0_matches[0].split(' ')[6];
    } else {
		return '';
    }
}


