import TopologyCanvas, { type CanvasEdge, type CanvasNode } from '@/components/figures/TopologyCanvas';
import Figure from '@/components/figures/Figure';

// A simplified slice of the Kappa Theta Pi environment. Positions are
// percentages of the drawing area; see DESIGN.md for the motion timing.
const nodes: CanvasNode[] = [
  { id: 'users', label: 'Users', x: 11, y: 48, delay: 0 },
  { id: 'traefik', label: 'Traefik', x: 38, y: 48, delay: 0.2 },
  { id: 'auth', label: 'Authentik', x: 76, y: 18, delay: 0.5 },
  { id: 'docker', label: 'Docker apps', x: 76, y: 48, delay: 0.5 },
  { id: 'lxc', label: 'LXC services', x: 76, y: 72, delay: 0.7 },
  { id: 'proxmox', label: 'Proxmox host', sub: 'Atlanta datacenter', x: 64, y: 92, w: 60, base: true, delay: 0.85 },
];

const edges: CanvasEdge[] = [
  { d: 'M11 48 H38', active: true, delay: 0.1 },
  { d: 'M38 48 H76', active: true, delay: 0.35 },
  { d: 'M38 48 H57 V18 H76', active: true, delay: 0.35 },
  { d: 'M76 48 V72', delay: 0.6 },
  { d: 'M76 72 V92', delay: 0.75 },
];

export default function HeroTopology() {
  return (
    <Figure number="01" caption="Production services I administer for Kappa Theta Pi, simplified.">
      <div className="px-6 pb-8 pt-12">
        <TopologyCanvas
          nodes={nodes}
          edges={edges}
          aspect={1.2}
          boundary={{ x: 24, left: 'internet', right: 'private network' }}
          label="Simplified diagram: users reach Traefik, which routes to Authentik single sign-on and Docker apps. Apps and LXC services run on a Proxmox host in an Atlanta datacenter."
        />
      </div>
    </Figure>
  );
}
