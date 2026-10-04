# Set up the chosen Cloudflare access

This guide covers the external service. For chill-agent's settings schema,
startup options, URLs, and shutdown commands, read the helper's `settings remote
--help` and `server start --help`. Recheck Cloudflare's official setup instructions
when working on an account; dashboard details may change.

## Fixed hostname with Access

The current connector uses a **locally managed named Tunnel**. It needs
cloudflared, a Cloudflare account, an active domain, and an Access application
for the chosen hostname. Offer installation if cloudflared is missing, and
have the user complete Cloudflare login. Reuse authorized resources where possible.

Cloudflare's setup sequence is `cloudflared tunnel login`, then
`cloudflared tunnel create <name>`. Before routing a new public hostname with
`cloudflared tunnel route dns <uuid> <hostname>`, establish the Access application
and allowed-user policy for that hostname. Use the user's actual choices for
account, hostname, and allowed people.

Collect the references required by `settings remote --help` from that setup.
Credentials remain in Cloudflare's normal credential file; copy only its path,
never its secret contents. The Access team name and application audience tag
are non-secret settings. The chill-agent connector creates its own ingress
configuration with Access JWT validation and a catch-all 404, without editing
an existing global cloudflared configuration or installing an always-on service.

Dashboard-managed token tunnels are not supported by this connector. Discuss
using a locally managed tunnel instead; keep protected access unconfigured if
that is not suitable.

After starting the configured server, verify that unauthenticated page and API
requests are blocked by Access. Have the user sign in on their phone and send
a comment on a test Plan. Check it arrived. Report the working URL and the
verified access scope; the connector reporting ready does not prove the policy.

## Temporary Quick test

Use Quick only when the user chooses an unauthenticated test URL. A separate
data directory can keep test content apart from private Plans. The generated
URL changes on restart; get the current one from server status. Try opening,
annotating, and sending feedback from the phone. Provide the URL, not a QR code.

## Official service instructions

- [Quick test URLs](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/)
- [Locally managed tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/)
- [Access application](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)
- [Origin access settings](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/origin-parameters/#access-settings)
