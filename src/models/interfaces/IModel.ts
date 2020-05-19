

export default interface IModel {
  public async find(query: Object)
  public async findOne(query: Object)
  public async aggregation(pipeline: Array<Object>)
}