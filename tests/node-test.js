import { expect } from 'chai';
import Node from '../lib/Node'

describe('NODE', () => {
  let node;

  beforeEach(() => {
    node = new Node('pizza')
  })

  it('should exist', () => {
    expect(node).to.exist
  })

  it('should be able to store child nodes', () => {
    expect(node.children).to.deep.equal({});
  })
})