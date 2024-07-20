export interface MetaTag {
  nodeName: 'meta' | 'script' | 'title' | 'link';
  type?: string;
  content?: string;
  property?: string;
  _text?: string;
  href?: string;
  rel?: string;
}
